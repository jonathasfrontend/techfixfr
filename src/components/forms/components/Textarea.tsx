import { TextareaHTMLAttributes } from 'react';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {

}

export function Textarea(props: TextareaProps) {
    return (
        <textarea {...props} className="bg-[#00140D] text-sm py-4 px-5 rounded-md outline-none placeholder:text-[#71717A] resize-none h-32" />
    );
}
