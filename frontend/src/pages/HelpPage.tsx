import React, { useState } from 'react';
import { Search, HelpCircle, MessageCircle, Mail, Phone, Clock, ChevronDown, ChevronUp, BookOpen, Users, Settings, Star, Heart, Film, TrendingUp, Grid3X3, User, Shield, LogOut, Globe, Bell, Eye, EyeOff } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import FadeIn from '../components/common/FadeIn';

const HelpPage: React.FC = () => {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedSections, setExpandedSections] = useState<{ [key: string]: boolean }>({});

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  const faqSections = [
    {
      id: 'getting-started',
      title: 'البدء',
      icon: BookOpen,
      questions: [
        {
          question: 'كيف يمكنني إنشاء حساب جديد؟',
          answer: 'يمكنك إنشاء حساب جديد من خلال النقر على زر "تسجيل" في أعلى الصفحة، ثم ملء النموذج بالمعلومات المطلوبة.'
        },
        {
          question: 'كيف يمكنني تسجيل الدخول؟',
          answer: 'يمكنك تسجيل الدخول من خلال النقر على زر "تسجيل الدخول" في أعلى الصفحة، ثم إدخال اسم المستخدم أو البريد الإلكتروني وكلمة المرور.'
        },
        {
          question: 'كيف يمكنني تغيير اللغة؟',
          answer: 'يمكنك تغيير اللغة من خلال النقر على أيقونة الكرة الأرضية في أعلى الصفحة، أو من خلال صفحة الإعدادات.'
        }
      ]
    },
    {
      id: 'search-and-browse',
      title: 'البحث والتصفح',
      icon: Search,
      questions: [
        {
          question: 'كيف يمكنني البحث عن أفلام معينة؟',
          answer: 'يمكنك استخدام شريط البحث في أعلى الصفحة للبحث عن الأفلام بالاسم، النوع، الممثل، أو المخرج.'
        },
        {
          question: 'كيف يمكنني تصفح الأفلام حسب النوع؟',
          answer: 'يمكنك النقر على "الأنواع" في القائمة الرئيسية لتصفح جميع الأنواع المتاحة، ثم النقر على نوع معين لرؤية الأفلام الخاصة به.'
        },
        {
          question: 'كيف يمكنني رؤية الأفلام الرائجة؟',
          answer: 'يمكنك النقر على "الرائج" في القائمة الرئيسية لرؤية الأفلام الأكثر شعبية حالياً.'
        }
      ]
    },
    {
      id: 'reviews-and-ratings',
      title: 'المراجعات والتقييمات',
      icon: Star,
      questions: [
        {
          question: 'كيف يمكنني إضافة مراجعة لفيلم؟',
          answer: 'اذهب إلى صفحة الفيلم، ثم انقر على "إضافة مراجعة" وأدخل تقييمك وتعليقك.'
        },
        {
          question: 'كيف يمكنني تعديل مراجعتي؟',
          answer: 'اذهب إلى صفحة الملف الشخصي، ثم انقر على "مراجعاتي" واختر المراجعة التي تريد تعديلها.'
        },
        {
          question: 'كيف يمكنني حذف مراجعتي؟',
          answer: 'اذهب إلى صفحة الملف الشخصي، ثم انقر على "مراجعاتي" واختر المراجعة التي تريد حذفها.'
        }
      ]
    },
    {
      id: 'watchlist',
      title: 'قائمة المفضلة',
      icon: Heart,
      questions: [
        {
          question: 'كيف يمكنني إضافة فيلم إلى قائمة المفضلة؟',
          answer: 'اذهب إلى صفحة الفيلم، ثم انقر على أيقونة القلب لإضافة الفيلم إلى قائمة المفضلة.'
        },
        {
          question: 'كيف يمكنني رؤية قائمة المفضلة؟',
          answer: 'انقر على اسم المستخدم في أعلى الصفحة، ثم اختر "قائمة المفضلة" من القائمة المنسدلة.'
        },
        {
          question: 'كيف يمكنني إزالة فيلم من قائمة المفضلة؟',
          answer: 'اذهب إلى صفحة قائمة المفضلة، ثم انقر على أيقونة X بجانب الفيلم الذي تريد إزالته.'
        }
      ]
    },
    {
      id: 'account-settings',
      title: 'إعدادات الحساب',
      icon: Settings,
      questions: [
        {
          question: 'كيف يمكنني تغيير معلومات الملف الشخصي؟',
          answer: 'اذهب إلى صفحة الإعدادات، ثم اختر "الملف الشخصي" وعدّل المعلومات المطلوبة.'
        },
        {
          question: 'كيف يمكنني تغيير كلمة المرور؟',
          answer: 'اذهب إلى صفحة الإعدادات، ثم اختر "الأمان" واتبع التعليمات لتغيير كلمة المرور.'
        },
        {
          question: 'كيف يمكنني حذف حسابي؟',
          answer: 'اذهب إلى صفحة الإعدادات، ثم اختر "حذف الحساب" واتبع التعليمات.'
        }
      ]
    },
    {
      id: 'technical-support',
      title: 'الدعم التقني',
      icon: HelpCircle,
      questions: [
        {
          question: 'الموقع لا يعمل بشكل صحيح، ماذا أفعل؟',
          answer: 'تأكد من أن متصفحك محدث، وامسح ذاكرة التخزين المؤقت، ثم أعد تحميل الصفحة.'
        },
        {
          question: 'لا يمكنني رؤية الصور، ماذا أفعل؟',
          answer: 'تأكد من أن اتصالك بالإنترنت يعمل بشكل صحيح، وامسح ذاكرة التخزين المؤقت للمتصفح.'
        },
        {
          question: 'كيف يمكنني الإبلاغ عن مشكلة؟',
          answer: 'يمكنك التواصل معنا من خلال صفحة "اتصل بنا" أو إرسال بريد إلكتروني إلى فريق الدعم.'
        }
      ]
    }
  ];

  const filteredSections = faqSections.filter(section =>
    section.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    section.questions.some(q => 
      q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.answer.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <FadeIn direction="up" delay={0}>
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-4">
              <HelpCircle className="w-8 h-8 text-blue-600" />
              <h1 className="text-4xl font-bold text-white">مركز المساعدة</h1>
            </div>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              ابحث عن إجابات لأسئلتك الشائعة أو تواصل معنا للحصول على المساعدة
            </p>
          </div>
        </FadeIn>

        {/* Search */}
        <FadeIn direction="up" delay={200}>
          <div className="max-w-2xl mx-auto mb-12">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="ابحث في الأسئلة الشائعة..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-gray-800 text-white pl-10 pr-4 py-3 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>
          </div>
        </FadeIn>

        {/* FAQ Sections */}
        <div className="space-y-8">
          {filteredSections.map((section, sectionIndex) => (
            <FadeIn key={section.id} direction="up" delay={300 + sectionIndex * 100}>
              <div className="bg-gray-800 rounded-xl overflow-hidden">
                <button
                  onClick={() => toggleSection(section.id)}
                  className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-700 transition-colors duration-200"
                >
                  <div className="flex items-center gap-4">
                    <section.icon className="w-6 h-6 text-blue-600" />
                    <h2 className="text-xl font-bold text-white">{section.title}</h2>
                  </div>
                  {expandedSections[section.id] ? (
                    <ChevronUp className="w-5 h-5 text-gray-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  )}
                </button>

                {expandedSections[section.id] && (
                  <div className="border-t border-gray-700">
                    <div className="p-6 space-y-6">
                      {section.questions.map((faq, index) => (
                        <div key={index} className="border-b border-gray-700 pb-4 last:border-b-0">
                          <h3 className="text-lg font-semibold text-white mb-2">{faq.question}</h3>
                          <p className="text-gray-300 leading-relaxed">{faq.answer}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </FadeIn>
          ))}
        </div>

        {/* Contact Section */}
        <FadeIn direction="up" delay={800}>
          <div className="mt-16 bg-gray-800 rounded-xl p-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">لم تجد ما تبحث عنه؟</h2>
              <p className="text-gray-400">تواصل معنا وسنكون سعداء لمساعدتك</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="bg-blue-600 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <Mail className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">البريد الإلكتروني</h3>
                <p className="text-gray-400 mb-2">support@movierate.com</p>
                <p className="text-sm text-gray-500">الرد خلال 24 ساعة</p>
              </div>

              <div className="text-center">
                <div className="bg-green-600 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <MessageCircle className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">الدردشة المباشرة</h3>
                <p className="text-gray-400 mb-2">متاحة 24/7</p>
                <p className="text-sm text-gray-500">الرد الفوري</p>
              </div>

              <div className="text-center">
                <div className="bg-purple-600 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <Phone className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">الهاتف</h3>
                <p className="text-gray-400 mb-2">+966 50 123 4567</p>
                <p className="text-sm text-gray-500">9 صباحاً - 6 مساءً</p>
              </div>
            </div>
          </div>
        </FadeIn>
      </div>
    </div>
  );
};

export default HelpPage;
