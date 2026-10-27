import { useId, type InputHTMLAttributes } from 'react';
import "./formField.css"

interface FormFieldProps extends InputHTMLAttributes<HTMLInputElement> {
    label: string;
    subtext?: string;
    className?: string;
}

function FormField({ label, subtext, className = '', id, ...rest }: FormFieldProps) {
    const generatedId = useId();
    const fieldId = id ?? generatedId;
    return (
        <div className={`form-group ${className}`}>
            <label htmlFor={fieldId}>
                {label} {subtext && <span>({subtext})</span>}
            </label>
            <input id={fieldId} {...rest} />
        </div>
    );
}

export default FormField;
