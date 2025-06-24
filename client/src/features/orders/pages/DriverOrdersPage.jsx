import { usePendingDeliveries } from '../hooks/usePendingDeliveries';
import PendingDeliveriesList from '../components/PendingDeliveriesList';
import LoadingSpinner from '../../core/components/LoadingSpinner.jsx'
import { useCallback } from 'react';

export default function DriverOrdersPage() {
  const { deliveries, loading, error, handleAccept, refetch } = usePendingDeliveries();

  const handleRetry = useCallback(() => {
    if (typeof refetch === 'function') refetch();
  }, [refetch]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-sky-100 to-indigo-100 flex flex-col items-center py-12 px-2">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl p-10 animate-fade-in-up transition-transform duration-300 hover:scale-[1.02]">
        <h2 className="text-3xl font-extrabold mb-1 text-blue-900 flex items-center gap-2">
          <svg xmlns='http://www.w3.org/2000/svg' className='h-8 w-8 text-blue-500' fill='none' viewBox='0 0 24 24' stroke='currentColor'><path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 17v-2a4 4 0 014-4h6m-6 0V7a4 4 0 00-4-4H5a4 4 0 00-4 4v10a4 4 0 004 4h6a4 4 0 004-4z' /></svg>
          Pending Deliveries
        </h2>
        <div className="border-b border-gray-200 my-3" />
        <p className="text-gray-600 mb-8 text-lg">Accept and manage your assigned deliveries below.</p>
        {loading ? (
          <div className="flex flex-col items-center justify-center min-h-[200px]">
            <LoadingSpinner />
            <span className="mt-2 text-gray-400">Loading deliveries...</span>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center min-h-[200px]">
            <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-3 border border-red-200 w-full text-center">
              {error}
            </div>
            <button
              onClick={handleRetry}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded shadow transition"
            >
              Retry
            </button>
          </div>
        ) : (
          <>
            {deliveries && deliveries.length > 0 ? (
              <PendingDeliveriesList deliveries={deliveries} onAccept={handleAccept} />
            ) : (
              <div className="flex flex-col items-center justify-center py-16">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 text-blue-200 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h2l.4 2M7 10h10l1.4 2M17 10h2m-9 4h4m-2 0v2m0-2v-2m0 2h-2m2 0h2" /></svg>
                <div className="text-xl font-semibold text-gray-400 mb-2">No pending deliveries found.</div>
                <div className="text-gray-400 text-sm">You're all caught up! New deliveries will appear here.</div>
              </div>
            )}
          </>
        )}
      </div>
      <style>{`
        @keyframes fade-in-up {
          0% { opacity: 0; transform: translateY(30px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.7s cubic-bezier(0.23, 1, 0.32, 1);
        }
      `}</style>
    </div>
  );
}
