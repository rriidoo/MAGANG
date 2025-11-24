import { Check, Target } from 'lucide-react';
import DynamicContent from './DynamicContent';
import { useContentValue } from '../contexts/ContentContext';

export default function About() {
  // Get requirements from content or use defaults
  const requirements = [
    useContentValue('about_requirement_1', 'Siswa SMK atau Mahasiswa aktif'),
    useContentValue('about_requirement_2', 'Minimum usia 17 tahun'),
    useContentValue('about_requirement_3', 'Memiliki laptop/komputer sendiri'),
    useContentValue('about_requirement_4', 'Komitmen untuk belajar dan berkembang'),
    useContentValue('about_requirement_5', 'Bersedia mengikuti program 3-6 bulan')
  ].filter(Boolean);

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-emerald-100 rounded-full px-6 py-3 mb-6">
            <Target className="w-5 h-5 text-emerald-600" />
            <DynamicContent
              contentKey="about_badge"
              defaultValue="PERSYARATAN MAGANG"
              className="text-sm font-black text-emerald-600"
            />
          </div>
          <DynamicContent
            contentKey="about_title"
            defaultValue="Siapa yang Bisa Ikut?"
            as="h2"
            className="text-4xl sm:text-5xl font-black text-slate-900 mb-6"
          />
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <DynamicContent
              contentKey="about_description"
              defaultValue="Program magang kami terbuka untuk siswa SMK dan mahasiswa yang ingin mendapatkan pengalaman kerja profesional. Siapkan dirimu untuk belajar dan berkembang bersama tim kami!"
              as="p"
              className="text-xl text-slate-600 mb-8 leading-relaxed font-medium"
            />

            <div className="space-y-4">
              {requirements.map((req, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 group"
                >
                  <div className="flex-shrink-0 w-7 h-7 bg-gradient-to-br from-emerald-500 to-lime-500 rounded-full flex items-center justify-center mt-1">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                  <p className="text-slate-800 font-bold group-hover:text-emerald-600 transition-colors text-lg">
                    {req}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 to-lime-500/20 rounded-3xl blur-3xl"></div>
            <div className="relative bg-gradient-to-br from-emerald-50 to-lime-50 p-8 rounded-3xl border-2 border-emerald-200 shadow-2xl">
              <div className="space-y-6">
                <div className="bg-white p-6 rounded-2xl shadow-lg border-2 border-emerald-200">
                  <div className="text-center">
                    <DynamicContent
                      contentKey="about_feature_1_emoji"
                      defaultValue="📚"
                      className="text-5xl mb-4"
                    />
                    <DynamicContent
                      contentKey="about_feature_1_title"
                      defaultValue="Belajar Skill Baru"
                      as="h3"
                      className="font-black text-slate-900 text-lg mb-2"
                    />
                    <DynamicContent
                      contentKey="about_feature_1_description"
                      defaultValue="Praktik langsung di proyek real"
                      className="text-sm text-slate-600 font-medium"
                    />
                  </div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-lg border-2 border-emerald-200">
                  <div className="text-center">
                    <DynamicContent
                      contentKey="about_feature_2_emoji"
                      defaultValue="👨‍🏫"
                      className="text-5xl mb-4"
                    />
                    <DynamicContent
                      contentKey="about_feature_2_title"
                      defaultValue="Mentoring Profesional"
                      as="h3"
                      className="font-black text-slate-900 text-lg mb-2"
                    />
                    <DynamicContent
                      contentKey="about_feature_2_description"
                      defaultValue="Bimbingan dari expert"
                      className="text-sm text-slate-600 font-medium"
                    />
                  </div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-lg border-2 border-emerald-200">
                  <div className="text-center">
                    <DynamicContent
                      contentKey="about_feature_3_emoji"
                      defaultValue="🏆"
                      className="text-5xl mb-4"
                    />
                    <DynamicContent
                      contentKey="about_feature_3_title"
                      defaultValue="Sertifikat Resmi"
                      as="h3"
                      className="font-black text-slate-900 text-lg mb-2"
                    />
                    <DynamicContent
                      contentKey="about_feature_3_description"
                      defaultValue="Tingkatkan CV kamu"
                      className="text-sm text-slate-600 font-medium"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
