import { ToggleButton } from "@/components/Utils/ToggleButton"
import { toggleMode } from "@/store/configSlice";
import { useState } from "react";
import { useDispatch } from "react-redux";

interface SettingsItemProps {
    type: string;
    prop: any;
}

const SettingsItem = (props: SettingsItemProps) => {

    const { type, prop } = props;

    return (
    <div className="flex justify-around w-full items-center">
        <span>{type}</span>
        {prop}
    </div>
    )
}

export const Settings = () => {
    const [isOn, setIsOn] = useState(false);

    const dispatch = useDispatch();

    const toggleDarkMode = () => {
        setIsOn(prev => !prev);
        dispatch(toggleMode());
    }

  return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-white dark:bg-neutral-900 rounded-xl shadow-md dark:shadow-lg transition">
        <div className="w-full flex flex-col gap-3 px-3">
            <SettingsItem type="Dark Mode" prop={<ToggleButton isOn={isOn} setIsOn={toggleDarkMode} />} />
        </div>
    </div>
  )
}
