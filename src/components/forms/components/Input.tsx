import { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement>{

}

export function Input(props: InputProps){
    return(
        <input {...props} className="bg-[#00140D] text-lg py-4 px-5 rounded-lg outline-none placeholder:text-[#71717A]"/>
    )
}