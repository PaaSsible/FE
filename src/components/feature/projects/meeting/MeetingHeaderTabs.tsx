import { useMeetingStore } from '@/stores/meetingStore'

export default function MeetingHeaderTabs() {
  const { mode, setMode } = useMeetingStore()

  return (
    <div className="flex justify-center gap-2 bg-[#1E1E1E] pt-10">
      <button
        onClick={() => setMode('meeting')}
        className={`rounded-md px-6 py-2 text-sm font-medium transition ${
          mode === 'meeting' ? 'bg-white text-black' : 'bg-gray-700 text-gray-300'
        }`}
      >
        회의
      </button>
      <button
        onClick={() => setMode('work')}
        className={`rounded-md px-6 py-2 text-sm font-medium transition ${
          mode === 'work' ? 'bg-white text-black' : 'bg-gray-700 text-gray-300'
        }`}
      >
        작업
      </button>
    </div>
  )
}
