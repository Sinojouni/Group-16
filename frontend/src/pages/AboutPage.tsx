import React from 'react';
import { Users, Award, BookOpen, Heart, Target, Lightbulb, Globe, Code, Database, Zap } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import FadeIn from '../components/common/FadeIn';
import StaggeredAnimation from '../components/common/StaggeredAnimation';

const AboutPage: React.FC = () => {
  const { t, language } = useLanguage();

  const isAr = language === 'ar';

  const teamMembers = [
    {
      name: isAr ? 'عضو الفريق 1' : 'Team Member 1',
      role: isAr ? 'مطور الواجهة الأمامية' : 'Frontend Developer',
      avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150',
      skills: ['React', 'TypeScript', 'Tailwind CSS']
    },
    {
      name: isAr ? 'عضو الفريق 2' : 'Team Member 2',
      role: isAr ? 'مطورة الواجهة الخلفية' : 'Backend Developer',
      avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150',
      skills: ['Python', 'Django', 'PostgreSQL']
    },
    {
      name: isAr ? 'عضو الفريق 3' : 'Team Member 3',
      role: isAr ? 'مصمم واجهة المستخدم' : 'UI/UX Designer',
      avatar: 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=150',
      skills: ['UI/UX', 'Figma', 'Adobe Suite']
    },
    {
      name: isAr ? 'عضو الفريق 4' : 'Team Member 4',
      role: isAr ? 'مطورة الذكاء الاصطناعي' : 'AI Engineer',
      avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150',
      skills: ['Machine Learning', 'TensorFlow', 'Python']
    },
    {
      name: isAr ? 'عضو الفريق 5' : 'Team Member 5',
      role: isAr ? 'مطور قاعدة البيانات' : 'Database Engineer',
      avatar: 'https://images.pexels.com/photos/1040881/pexels-photo-1040881.jpeg?auto=compress&cs=tinysrgb&w=150',
      skills: ['Database Design', 'SQL', 'MongoDB']
    }
  ];

  const features = [
    {
      icon: Target,
      title: isAr ? 'توصيات ذكية' : 'Smart Recommendations',
      description: isAr 
        ? 'نظام توصيات متقدم يستخدم الذكاء الاصطناعي لاقتراح الأفلام المناسبة لك'
        : 'Advanced AI recommendation engine tailored to your unique taste.'
    },
    {
      icon: Heart,
      title: isAr ? 'تجربة شخصية' : 'Personalized Experience',
      description: isAr
        ? 'واجهة مخصصة تتعلم من تفضيلاتك لتقدم لك أفضل تجربة مشاهدة'
        : 'Customized interface that adapts to your habits for the best viewing experience.'
    },
    {
      icon: Globe,
      title: isAr ? 'دعم متعدد اللغات' : 'Multilingual Support',
      description: isAr
        ? 'دعم كامل للغة العربية والإنجليزية مع واجهة سهلة الاستخدام'
        : 'Full support for Arabic and English with a seamless, responsive UI.'
    },
    {
      icon: Zap,
      title: isAr ? 'أداء سريع' : 'Fast Performance',
      description: isAr
        ? 'تقنيات متقدمة لضمان سرعة التحميل والأداء الأمثل'
        : 'Modern tech stack ensuring ultra-fast loading and optimal performance.'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <FadeIn direction="up" delay={0}>
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              {isAr ? 'من نحن؟' : 'About Us'}
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              {isAr
                ? 'نحن فريق DeepMind من دورة سامسونج، نعمل على تطوير منصة ذكية لتوصيات الأفلام والمسلسلات باستخدام أحدث تقنيات الذكاء الاصطناعي'
                : 'We are DeepMind Team from the Samsung AI Course, developing an intelligent movie and TV recommendation platform powered by modern AI.'}
            </p>
          </div>
        </FadeIn>

        {/* Mission Section */}
        <FadeIn direction="up" delay={200}>
          <div className="bg-gray-800 rounded-2xl p-8 mb-16">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold text-white mb-6">
                  {isAr ? 'رؤيتنا' : 'Our Vision'}
                </h2>
                <p className="text-gray-300 text-lg leading-relaxed mb-6">
                  {isAr
                    ? 'نؤمن بأن كل شخص يستحق تجربة مشاهدة مخصصة تناسب ذوقه الفني. من خلال دمج الذكاء الاصطناعي مع فهم عميق لاحتياجات المستخدمين، نهدف إلى إحداث ثورة في طريقة اكتشاف المحتوى السينمائي.'
                    : 'We believe everyone deserves a personalized cinema experience tailored to their taste. By blending artificial intelligence with a deep understanding of user needs, we aim to revolutionize content discovery.'}
                </p>
                <div className="flex items-center gap-3">
                  <Award className="w-6 h-6 text-yellow-500" />
                  <span className="text-white font-semibold">
                    {isAr ? 'مشروع تخرج - دورة سامسونج' : 'Graduation Project - Samsung Course'}
                  </span>
                </div>
              </div>
              <div className="bg-gradient-to-br from-red-600 to-purple-600 rounded-xl p-8 text-center">
                <BookOpen className="w-16 h-16 text-white mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-white mb-2">
                  {isAr ? 'فريق DeepMind' : 'DeepMind Team'}
                </h3>
                <p className="text-gray-200">
                  {isAr ? 'كروب 16' : 'Group 16'}
                </p>
              </div>
            </div>
          </div>
        </FadeIn>

        {/* Features Section */}
        <FadeIn direction="up" delay={400}>
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-white text-center mb-12">
              {isAr ? 'مميزاتنا' : 'Our Features'}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <StaggeredAnimation key={index} direction="up" staggerDelay={index * 150} duration={800}>
                  <div className="bg-gray-800 rounded-xl p-6 text-center hover:bg-gray-750 hover:scale-105 transition-all duration-300 group">
                    <feature.icon className="w-12 h-12 text-red-600 mx-auto mb-4 group-hover:text-red-500 transition-colors duration-300" />
                    <h3 className="text-xl font-bold text-white mb-3 group-hover:text-gray-100 transition-colors duration-300">{feature.title}</h3>
                    <p className="text-gray-300 text-sm leading-relaxed group-hover:text-gray-200 transition-colors duration-300">{feature.description}</p>
                  </div>
                </StaggeredAnimation>
              ))}
            </div>
          </div>
        </FadeIn>

        {/* Team Section */}
        <FadeIn direction="up" delay={800}>
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-white text-center mb-12">
              {isAr ? 'فريقنا' : 'Our Team'}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-8">
              {teamMembers.map((member, index) => (
                <StaggeredAnimation key={index} direction="up" staggerDelay={index * 200} duration={900}>
                  <div className="bg-gray-800 rounded-xl p-6 text-center hover:bg-gray-750 hover:scale-105 hover:-translate-y-2 transition-all duration-500 group">
                    <img
                      src={member.avatar}
                      alt={member.name}
                      className="w-20 h-20 rounded-full mx-auto mb-4 object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-gray-100 transition-colors duration-300">{member.name}</h3>
                    <p className="text-gray-400 mb-4 group-hover:text-gray-300 transition-colors duration-300">{member.role}</p>
                    <div className="flex flex-wrap gap-2 justify-center">
                      {member.skills.map((skill, skillIndex) => (
                        <span
                          key={skillIndex}
                          className="bg-red-600 text-white px-3 py-1 rounded-full text-sm group-hover:bg-red-500 transition-colors duration-300"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </StaggeredAnimation>
              ))}
            </div>
          </div>
        </FadeIn>

        {/* Technology Section */}
        <FadeIn direction="up" delay={1200}>
          <div className="bg-gray-800 rounded-2xl p-8">
            <h2 className="text-3xl font-bold text-white text-center mb-12">
              {isAr ? 'التقنيات المستخدمة' : 'Technologies Used'}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <StaggeredAnimation direction="up" staggerDelay={0} duration={800}>
                <div className="text-center hover:scale-105 transition-all duration-500 group">
                  <Code className="w-12 h-12 text-blue-500 mx-auto mb-4 group-hover:text-blue-400 transition-colors duration-300" />
                  <h3 className="text-xl font-bold text-white mb-3 group-hover:text-gray-100 transition-colors duration-300">
                    {isAr ? 'الواجهة الأمامية' : 'Frontend'}
                  </h3>
                  <p className="text-gray-300 group-hover:text-gray-200 transition-colors duration-300">React, TypeScript, Tailwind CSS, Vite</p>
                </div>
              </StaggeredAnimation>
              <StaggeredAnimation direction="up" staggerDelay={200} duration={800}>
                <div className="text-center hover:scale-105 transition-all duration-500 group">
                  <Database className="w-12 h-12 text-green-500 mx-auto mb-4 group-hover:text-green-400 transition-colors duration-300" />
                  <h3 className="text-xl font-bold text-white mb-3 group-hover:text-gray-100 transition-colors duration-300">
                    {isAr ? 'الواجهة الخلفية' : 'Backend'}
                  </h3>
                  <p className="text-gray-300 group-hover:text-gray-200 transition-colors duration-300">Python, Django, PostgreSQL, Celery</p>
                </div>
              </StaggeredAnimation>
              <StaggeredAnimation direction="up" staggerDelay={400} duration={800}>
                <div className="text-center hover:scale-105 transition-all duration-500 group">
                  <Lightbulb className="w-12 h-12 text-yellow-500 mx-auto mb-4 group-hover:text-yellow-400 transition-colors duration-300" />
                  <h3 className="text-xl font-bold text-white mb-3 group-hover:text-gray-100 transition-colors duration-300">
                    {isAr ? 'الذكاء الاصطناعي' : 'Artificial Intelligence'}
                  </h3>
                  <p className="text-gray-300 group-hover:text-gray-200 transition-colors duration-300">TensorFlow, Scikit-learn, Pandas</p>
                </div>
              </StaggeredAnimation>
            </div>
          </div>
        </FadeIn>
      </div>
    </div>
  );
};

export default AboutPage;
