import { useContent } from '../contexts/ContentContext';

// Component ini untuk debug - lihat konten apa yang ter-load dari database
// Bisa ditambahkan sementara di App.tsx untuk debugging
export default function ContentDebug() {
  const { content, loading } = useContent();

  if (loading) {
    return (
      <div className="fixed bottom-20 right-6 bg-blue-500 text-white p-4 rounded-lg shadow-lg z-30 max-w-md">
        <p>Loading content...</p>
      </div>
    );
  }

  const heroContent = Object.values(content).filter(item => item.section === 'hero');

  return (
    <div className="fixed bottom-20 right-6 bg-slate-900 text-white p-4 rounded-lg shadow-lg z-30 max-w-md max-h-96 overflow-y-auto">
      <h3 className="font-bold mb-2 text-yellow-400">🔍 Content Debug (Hero Section)</h3>
      <p className="text-xs text-slate-400 mb-3">Total: {heroContent.length} items</p>
      
      {heroContent.length === 0 ? (
        <p className="text-red-400 text-sm">❌ Tidak ada konten hero di database!</p>
      ) : (
        <div className="space-y-2 text-xs">
          {heroContent.map((item) => (
            <div key={item.id} className="bg-slate-800 p-2 rounded border border-slate-700">
              <div className="font-mono text-yellow-300">{item.key}</div>
              <div className="text-slate-300 mt-1">{item.value}</div>
              <div className="text-slate-500 text-xs mt-1">
                {item.type} • {item.section}
              </div>
            </div>
          ))}
        </div>
      )}
      
      <div className="mt-4 pt-3 border-t border-slate-700">
        <p className="text-xs text-slate-400">
          Key yang digunakan di Hero.tsx:
        </p>
        <div className="mt-2 space-y-1 text-xs font-mono text-green-400">
          <div>• hero_badge</div>
          <div>• hero_title</div>
          <div>• hero_subtitle</div>
          <div>• hero_description</div>
          <div>• hero_stat_1_value</div>
          <div>• hero_stat_1_label</div>
          <div>• hero_stat_2_value</div>
          <div>• hero_stat_2_label</div>
          <div>• hero_stat_3_value</div>
          <div>• hero_stat_3_label</div>
          <div>• hero_stat_4_value</div>
          <div>• hero_stat_4_label</div>
        </div>
      </div>
    </div>
  );
}

