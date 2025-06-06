import { Dispatch, SetStateAction } from "react";

interface ToggleButtonProps {
    isOn: boolean;
    setIsOn: Dispatch<SetStateAction<boolean>>;
}


export const ToggleButton = (props: ToggleButtonProps) => {

    const { isOn, setIsOn } = props;

  return (
    <div 
        className={`rounded-full w-14 text-sm h-6.5 border-1 border-black relative ${ isOn ? 'bg-lime-400' : 'bg-slate-400' } cursor-pointer transition-all duration-200`}
        onClick={() => setIsOn(prev => !prev)}
    >
        <div className={`w-5 h-5 rounded-full absolute border-1 border-black bg-white transform transition-transform top-0.5 left-0.5 ${ isOn? 'translate-x-[150%]' : 
            ''
         } `}></div>
    </div>
  )
}
