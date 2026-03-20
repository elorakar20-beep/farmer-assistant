import { AssistResponse } from '@/lib/schema';

interface ResultCardProps {
  result: AssistResponse | null;
}

export default function ResultCard({ result }: ResultCardProps) {
  if (!result) return null;

  return (
    <div className="w-full max-w-2xl mx-auto mt-8 bg-white rounded-2xl shadow-xl overflow-hidden border border-green-100">
      <div className="bg-green-50 px-6 py-4 border-b border-green-100 flex justify-between items-center">
        <h2 className="text-xl font-semibold text-green-800">Analysis Result</h2>
        <span className="text-sm font-medium px-3 py-1 bg-green-200 text-green-800 rounded-full">
          Confidence: {result.confidence_score}
        </span>
      </div>
      
      <div className="p-6 space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Detected Crop</h3>
            <p className="mt-1 text-lg font-medium text-gray-900">{result.crop}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Detected Issue</h3>
            <p className="mt-1 text-lg font-medium text-gray-900">{result.issue_detected}</p>
          </div>
        </div>

        <div>
          <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Likely Cause</h3>
          <p className="text-red-700 font-medium bg-red-50 border border-red-100 p-4 rounded-xl">{result.likely_cause}</p>
        </div>

        <div>
          <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Weather Adjustment</h3>
          <p className="text-blue-700 font-medium bg-blue-50 border border-blue-100 p-4 rounded-xl">{result.weather_adjustment}</p>
        </div>

        <div>
          <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Recommended Actions</h3>
          <ul className="space-y-3">
            {result.recommended_actions.map((action, index) => (
              <li key={index} className="flex items-start bg-gray-50 p-3 rounded-lg border border-gray-100">
                <span className="flex-shrink-0 h-6 w-6 text-green-500 mr-3 flex items-center justify-center font-bold">
                  ✓
                </span>
                <span className="text-gray-800">{action}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
