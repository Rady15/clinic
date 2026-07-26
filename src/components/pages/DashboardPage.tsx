'use client';

import { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useNavigationStore } from '@/store/navigation-store';
import { useLanguageStore } from '@/store/language-store';
import { motion } from 'framer-motion';
import { User, Package, Calendar, Star, MessageSquare, LogOut, ChevronLeft, Phone, Mail, Edit3, Save, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

type Tab = 'overview' | 'orders' | 'bookings' | 'ratings' | 'messages' | 'profile';

interface UserProfile { id: string; name: string; email: string; phone: string | null; image: string | null; role: string; createdAt: string; }
interface Order { id: string; name: string; email: string; phone: string; total: number; subtotal: number; tax: number; status: string; paymentStatus: string; createdAt: string; items: { nameAr: string; nameEn: string; price: number; quantity: number; image: string }[]; }
interface Booking { id: string; name: string; phone: string; email: string; department: string; date: string; time: string; notes: string; status: string; paymentStatus: string; createdAt: string; }
interface Rating { id: string; name: string; department: string; cleanliness: number; staffFriendly: number; staffCoop: number; comment: string; createdAt: string; }
interface Message { id: string; name: string; email: string; subject: string; message: string; isRead: boolean; createdAt: string; }

export default function DashboardPage() {
  const { data: session } = useSession();
  const { setCurrentPage } = useNavigationStore();
  const { locale } = useLanguageStore();
  const { toast } = useToast();
  const [tab, setTab] = useState<Tab>('overview');
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [ratings, setRatings] = useState<Rating[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingProfile, setEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({ name: '', phone: '' });

  useEffect(() => {
    if (!session) { setCurrentPage('account'); return; }
    loadData();
  }, [session]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [p, o, b, r, m] = await Promise.all([
        fetch('/api/user/profile').then(r => r.ok ? r.json() : null),
        fetch('/api/user/orders').then(r => r.ok ? r.json() : []),
        fetch('/api/user/bookings').then(r => r.ok ? r.json() : []),
        fetch('/api/user/ratings').then(r => r.ok ? r.json() : []),
        fetch('/api/user/messages').then(r => r.ok ? r.json() : []),
      ]);
      setProfile(p);
      if (p) setProfileForm({ name: p.name || '', phone: p.phone || '' });
      setOrders(o);
      setBookings(b);
      setRatings(r);
      setMessages(m);
    } catch { /* ignore */ }
    setLoading(false);
  };

  const handleSaveProfile = async () => {
    try {
      const res = await fetch('/api/user/profile', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(profileForm) });
      if (res.ok) {
        const updated = await res.json();
        setProfile(updated);
        setEditingProfile(false);
        toast({ title: locale === 'en' ? 'Profile updated!' : 'تم تحديث الملف الشخصي!' });
      }
    } catch { toast({ title: 'حدث خطأ', variant: 'destructive' }); }
  };

  const handleLogout = async () => {
    await signOut({ redirect: false });
    setCurrentPage('home');
  };

  const l = (ar: string, en: string) => locale === 'ar' ? ar : en;

  const statusColor = (s: string) => {
    if (s === 'confirmed' || s === 'paid' || s === 'completed') return 'text-green-600 bg-green-50';
    if (s === 'pending') return 'text-yellow-600 bg-yellow-50';
    if (s === 'cancelled' || s === 'failed') return 'text-red-600 bg-red-50';
    return 'text-gray-600 bg-gray-50';
  };

  const statusLabel = (s: string) => {
    const map: Record<string, Record<string, string>> = {
      confirmed: { ar: 'مؤكد', en: 'Confirmed' },
      pending: { ar: 'قيد الانتظار', en: 'Pending' },
      cancelled: { ar: 'ملغي', en: 'Cancelled' },
      paid: { ar: 'مدفوع', en: 'Paid' },
      failed: { ar: 'فشل', en: 'Failed' },
      completed: { ar: 'مكتمل', en: 'Completed' },
    };
    return map[s]?.[locale] || s;
  };

  const tabs: { key: Tab; icon: React.ReactNode; label: string; count?: number }[] = [
    { key: 'overview', icon: <User className="w-4 h-4" />, label: l('الملف الشخصي', 'Profile') },
    { key: 'orders', icon: <Package className="w-4 h-4" />, label: l('مشترياتي', 'My Orders'), count: orders.length },
    { key: 'bookings', icon: <Calendar className="w-4 h-4" />, label: l('حجوزاتي', 'My Bookings'), count: bookings.length },
    { key: 'ratings', icon: <Star className="w-4 h-4" />, label: l('تقييماتي', 'My Ratings'), count: ratings.length },
    { key: 'messages', icon: <MessageSquare className="w-4 h-4" />, label: l('رسائلي', 'My Messages'), count: messages.length },
  ];

  if (!session) return null;

  return (
    <main className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-[#2C3E50]">{l('لوحة حسابي', 'My Dashboard')}</h1>
            <p className="text-[#7F8C8D] mt-1">{l('مرحباً', 'Welcome')}, {profile?.name || session.user?.name}</p>
          </div>
          <button onClick={handleLogout} className="flex items-center gap-2 text-sm text-[#7F8C8D] hover:text-red-500 transition-colors">
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">{l('تسجيل خروج', 'Logout')}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar Tabs */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm p-2 sticky top-24">
              {tabs.map(t => (
                <button
                  key={t.key}
                  onClick={() => setTab(t.key)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${tab === t.key ? 'bg-[#6DB3D7] text-white' : 'text-[#333] hover:bg-[#EBF5FB]'}`}
                >
                  {t.icon}
                  <span className="flex-1 text-right">{t.label}</span>
                  {t.count !== undefined && (
                    <span className={`text-xs px-2 py-0.5 rounded-full ${tab === t.key ? 'bg-white/20' : 'bg-gray-100 text-[#7F8C8D]'}`}>{t.count}</span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="lg:col-span-3">
            {loading ? (
              <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
                <div className="w-8 h-8 border-4 border-[#6DB3D7]/30 border-t-[#6DB3D7] rounded-full animate-spin mx-auto" />
              </div>
            ) : (
              <motion.div key={tab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>

                {/* OVERVIEW */}
                {tab === 'overview' && (
                  <div className="space-y-6">
                    <div className="bg-white rounded-2xl shadow-sm p-6">
                      <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-bold text-[#2C3E50]">{l('المعلومات الشخصية', 'Personal Information')}</h2>
                        {!editingProfile ? (
                          <button onClick={() => setEditingProfile(true)} className="flex items-center gap-1 text-sm text-[#6DB3D7] hover:underline">
                            <Edit3 className="w-4 h-4" /> {l('تعديل', 'Edit')}
                          </button>
                        ) : (
                          <button onClick={() => setEditingProfile(false)} className="text-gray-400 hover:text-gray-600"><X className="w-4 h-4" /></button>
                        )}
                      </div>
                      {editingProfile ? (
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-[#333] mb-1">{l('الاسم', 'Name')}</label>
                            <Input value={profileForm.name} onChange={e => setProfileForm({ ...profileForm, name: e.target.value })} className="h-11 rounded-xl" />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-[#333] mb-1">{l('الهاتف', 'Phone')}</label>
                            <Input value={profileForm.phone} onChange={e => setProfileForm({ ...profileForm, phone: e.target.value })} className="h-11 rounded-xl" dir="ltr" />
                          </div>
                          <Button onClick={handleSaveProfile} className="bg-[#6DB3D7] hover:bg-[#5DADE2]"><Save className="w-4 h-4 ml-2" /> {l('حفظ', 'Save')}</Button>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                            <User className="w-5 h-5 text-[#6DB3D7]" />
                            <div>
                              <p className="text-xs text-[#7F8C8D]">{l('الاسم', 'Name')}</p>
                              <p className="font-medium text-[#333]">{profile?.name || '-'}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                            <Mail className="w-5 h-5 text-[#6DB3D7]" />
                            <div>
                              <p className="text-xs text-[#7F8C8D]">{l('البريد الإلكتروني', 'Email')}</p>
                              <p className="font-medium text-[#333]" dir="ltr">{profile?.email || '-'}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                            <Phone className="w-5 h-5 text-[#6DB3D7]" />
                            <div>
                              <p className="text-xs text-[#7F8C8D]">{l('الهاتف', 'Phone')}</p>
                              <p className="font-medium text-[#333]" dir="ltr">{profile?.phone || '-'}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                            <Calendar className="w-5 h-5 text-[#6DB3D7]" />
                            <div>
                              <p className="text-xs text-[#7F8C8D]">{l('تاريخ التسجيل', 'Joined')}</p>
                              <p className="font-medium text-[#333]">{profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString(locale === 'ar' ? 'ar-SA' : 'en-US') : '-'}</p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      {[
                        { label: l('مشترياتي', 'Orders'), value: orders.length, icon: <Package className="w-5 h-5" />, color: 'bg-blue-50 text-blue-600' },
                        { label: l('حجوزاتي', 'Bookings'), value: bookings.length, icon: <Calendar className="w-5 h-5" />, color: 'bg-purple-50 text-purple-600' },
                        { label: l('تقييماتي', 'Ratings'), value: ratings.length, icon: <Star className="w-5 h-5" />, color: 'bg-yellow-50 text-yellow-600' },
                        { label: l('رسائلي', 'Messages'), value: messages.length, icon: <MessageSquare className="w-5 h-5" />, color: 'bg-green-50 text-green-600' },
                      ].map((s, i) => (
                        <div key={i} className="bg-white rounded-2xl shadow-sm p-4 text-center">
                          <div className={`w-10 h-10 rounded-full ${s.color} flex items-center justify-center mx-auto mb-2`}>{s.icon}</div>
                          <p className="text-2xl font-bold text-[#2C3E50]">{s.value}</p>
                          <p className="text-xs text-[#7F8C8D] mt-1">{s.label}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* ORDERS */}
                {tab === 'orders' && (
                  <div className="bg-white rounded-2xl shadow-sm p-6">
                    <h2 className="text-lg font-bold text-[#2C3E50] mb-6">{l('مشترياتي', 'My Orders')}</h2>
                    {orders.length === 0 ? (
                      <p className="text-center text-[#7F8C8D] py-12">{l('لا توجد مشتريات بعد', 'No orders yet')}</p>
                    ) : (
                      <div className="space-y-4">
                        {orders.map(order => (
                          <div key={order.id} className="border border-gray-100 rounded-xl p-4 hover:shadow-sm transition-shadow">
                            <div className="flex items-center justify-between mb-3">
                              <div>
                                <p className="text-sm text-[#7F8C8D]">{l('طلب رقم', 'Order #')}{order.id.slice(-8)}</p>
                                <p className="text-xs text-[#7F8C8D] mt-1">{new Date(order.createdAt).toLocaleDateString(locale === 'ar' ? 'ar-SA' : 'en-US')}</p>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className={`text-xs px-3 py-1 rounded-full font-medium ${statusColor(order.status)}`}>{statusLabel(order.status)}</span>
                                <span className={`text-xs px-3 py-1 rounded-full font-medium ${statusColor(order.paymentStatus)}`}>{statusLabel(order.paymentStatus)}</span>
                              </div>
                            </div>
                            <div className="space-y-2">
                              {order.items.map((item, i) => (
                                <div key={i} className="flex items-center gap-3 text-sm">
                                  {item.image && <img src={item.image} alt="" className="w-10 h-10 rounded-lg object-cover" />}
                                  <span className="flex-1 text-[#333]">{locale === 'en' ? item.nameEn || item.nameAr : item.nameAr}</span>
                                  <span className="text-[#7F8C8D]">x{item.quantity}</span>
                                  <span className="font-semibold text-[#333]">{item.price.toLocaleString()} {l('﷼', 'SAR')}</span>
                                </div>
                              ))}
                            </div>
                            <div className="border-t border-gray-100 mt-3 pt-3 flex items-center justify-between">
                              <span className="text-sm text-[#7F8C8D]">{l('الإجمالي', 'Total')}</span>
                              <span className="font-bold text-[#6DB3D7]">{order.total.toLocaleString()} {l('﷼', 'SAR')}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* BOOKINGS */}
                {tab === 'bookings' && (
                  <div className="bg-white rounded-2xl shadow-sm p-6">
                    <h2 className="text-lg font-bold text-[#2C3E50] mb-6">{l('حجوزاتي', 'My Bookings')}</h2>
                    {bookings.length === 0 ? (
                      <p className="text-center text-[#7F8C8D] py-12">{l('لا توجد حجوزات بعد', 'No bookings yet')}</p>
                    ) : (
                      <div className="space-y-4">
                        {bookings.map(b => (
                          <div key={b.id} className="border border-gray-100 rounded-xl p-4 hover:shadow-sm transition-shadow">
                            <div className="flex items-center justify-between mb-2">
                              <div>
                                <p className="font-semibold text-[#333]">{b.department}</p>
                                <p className="text-xs text-[#7F8C8D] mt-1">{new Date(b.createdAt).toLocaleDateString(locale === 'ar' ? 'ar-SA' : 'en-US')}</p>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className={`text-xs px-3 py-1 rounded-full font-medium ${statusColor(b.status)}`}>{statusLabel(b.status)}</span>
                                <span className={`text-xs px-3 py-1 rounded-full font-medium ${statusColor(b.paymentStatus)}`}>{statusLabel(b.paymentStatus)}</span>
                              </div>
                            </div>
                            <div className="grid grid-cols-2 gap-2 text-sm mt-3">
                              {b.date && <div><span className="text-[#7F8C8D]">{l('التاريخ', 'Date')}: </span><span className="text-[#333]">{b.date}</span></div>}
                              {b.time && <div><span className="text-[#7F8C8D]">{l('الوقت', 'Time')}: </span><span className="text-[#333]">{b.time}</span></div>}
                              {b.phone && <div><span className="text-[#7F8C8D]">{l('الهاتف', 'Phone')}: </span><span className="text-[#333]" dir="ltr">{b.phone}</span></div>}
                            </div>
                            {b.notes && <p className="text-sm text-[#7F8C8D] mt-2 italic">&quot;{b.notes}&quot;</p>}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* RATINGS */}
                {tab === 'ratings' && (
                  <div className="bg-white rounded-2xl shadow-sm p-6">
                    <h2 className="text-lg font-bold text-[#2C3E50] mb-6">{l('تقييماتي', 'My Ratings')}</h2>
                    {ratings.length === 0 ? (
                      <p className="text-center text-[#7F8C8D] py-12">{l('لا توجد تقييمات بعد', 'No ratings yet')}</p>
                    ) : (
                      <div className="space-y-4">
                        {ratings.map(r => (
                          <div key={r.id} className="border border-gray-100 rounded-xl p-4">
                            <div className="flex items-center justify-between mb-2">
                              <p className="font-semibold text-[#333]">{r.department}</p>
                              <p className="text-xs text-[#7F8C8D]">{new Date(r.createdAt).toLocaleDateString(locale === 'ar' ? 'ar-SA' : 'en-US')}</p>
                            </div>
                            <div className="grid grid-cols-3 gap-3 mb-3">
                              {[{ label: l('النظافة', 'Cleanliness'), val: r.cleanliness }, { label: l('لطافة الكادر', 'Staff Friendly'), val: r.staffFriendly }, { label: l('تعاون الكادر', 'Staff Coop'), val: r.staffCoop }].map((s, i) => (
                                <div key={i} className="text-center">
                                  <div className="flex items-center justify-center gap-0.5">
                                    {[1,2,3,4,5].map(n => <Star key={n} className={`w-3 h-3 ${n <= s.val ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200'}`} />)}
                                  </div>
                                  <p className="text-[10px] text-[#7F8C8D] mt-1">{s.label}</p>
                                </div>
                              ))}
                            </div>
                            {r.comment && <p className="text-sm text-[#7F8C8D] italic">&quot;{r.comment}&quot;</p>}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* MESSAGES */}
                {tab === 'messages' && (
                  <div className="bg-white rounded-2xl shadow-sm p-6">
                    <h2 className="text-lg font-bold text-[#2C3E50] mb-6">{l('رسائلي', 'My Messages')}</h2>
                    {messages.length === 0 ? (
                      <p className="text-center text-[#7F8C8D] py-12">{l('لا توجد رسائل بعد', 'No messages yet')}</p>
                    ) : (
                      <div className="space-y-4">
                        {messages.map(m => (
                          <div key={m.id} className={`border rounded-xl p-4 transition-shadow hover:shadow-sm ${m.isRead ? 'border-gray-100' : 'border-[#6DB3D7]/30 bg-[#EBF5FB]/30'}`}>
                            <div className="flex items-center justify-between mb-2">
                              <div>
                                <p className="font-semibold text-[#333]">{m.subject}</p>
                                <p className="text-xs text-[#7F8C8D] mt-1">{new Date(m.createdAt).toLocaleDateString(locale === 'ar' ? 'ar-SA' : 'en-US')}</p>
                              </div>
                              {!m.isRead && <span className="w-2 h-2 bg-[#6DB3D7] rounded-full" />}
                            </div>
                            <p className="text-sm text-[#555] line-clamp-3">{m.message}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

              </motion.div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
