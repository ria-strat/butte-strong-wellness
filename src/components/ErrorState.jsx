export default function ErrorState({ message = 'Something went wrong. Please try again.' }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
      <div className="w-12 h-12 rounded-full bg-gold/20 flex items-center justify-center mb-4">
        <span className="text-gold text-xl">!</span>
      </div>
      <p className="font-sans text-navy/60 text-sm max-w-xs">{message}</p>
    </div>
  )
}
