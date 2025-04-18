export const ProgressBar = ({ completion }: { completion: number }) => {
  return (
    <div className="w-[80%] border border-black bg-[#000000] h-2 rounded-full">
        <div className={`bg-lime-400 h-full rounded-full transition-all duration-300`} style={{ width: `${completion}%` }}>

        </div>
    </div>
  )
}
