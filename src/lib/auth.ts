import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import bcrypt from 'bcryptjs';
import { db } from '@/lib/db';

const providers: NextAuthOptions['providers'] = [
  CredentialsProvider({
    name: 'credentials',
    credentials: {
      email: { label: 'Email or Username', type: 'text' },
      password: { label: 'Password', type: 'password' },
    },
    async authorize(credentials) {
      if (!credentials?.email || !credentials?.password) return null;

      const identifier = credentials.email;

      // Check Admin table (plain text password)
      const admin = await db.admin.findFirst({
        where: { OR: [{ username: identifier }, { name: identifier }] },
      });
      if (admin && credentials.password === admin.password) {
        // Create or find a User record for this admin so NextAuth session works
        let user = await db.user.findFirst({ where: { name: admin.name } });
        if (!user) {
          const bcryptHash = await bcrypt.hash(admin.password, 10);
          user = await db.user.create({
            data: { name: admin.name, email: `${admin.username}@admin.local`, password: bcryptHash, role: 'admin' },
          });
        } else if (user.role !== 'admin') {
          user = await db.user.update({ where: { id: user.id }, data: { role: 'admin' } });
        }
        return { id: user.id, name: user.name, email: user.email, image: user.image };
      }

      // Check User table (bcrypt password)
      const user = await db.user.findFirst({
        where: { OR: [{ email: identifier }, { name: identifier }] },
      });
      if (!user || !user.password) return null;

      const valid = await bcrypt.compare(credentials.password, user.password);
      if (!valid) return null;

      return { id: user.id, name: user.name, email: user.email, image: user.image };
    },
  }),
];

if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  providers.push(
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    })
  );
}

export const authOptions: NextAuthOptions = {
  providers,
  session: { strategy: 'jwt' },
  pages: { signIn: '/account' },
  secret: process.env.NEXTAUTH_SECRET || 'fallback-secret-for-dev-only',
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === 'google' && user.email) {
        const existing = await db.user.findUnique({ where: { email: user.email } });
        if (!existing) {
          await db.user.create({
            data: {
              name: user.name ?? 'User',
              email: user.email,
              image: user.image,
              emailVerified: new Date(),
            },
          });
        }
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id;
      }
      return session;
    },
  },
};
