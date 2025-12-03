'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

// ============================================
// TABS COMPONENT - Brutalist Style
// ============================================

interface TabsContextValue {
    value: string;
    onValueChange: (value: string) => void;
}

const TabsContext = React.createContext<TabsContextValue | null>(null);

function useTabsContext() {
    const context = React.useContext(TabsContext);
    if (!context) {
        throw new Error('Tabs components must be used within a Tabs provider');
    }
    return context;
}

interface TabsProps {
    defaultValue: string;
    value?: string;
    onValueChange?: (value: string) => void;
    children: React.ReactNode;
    className?: string;
}

export function Tabs({ defaultValue, value, onValueChange, children, className }: TabsProps) {
    const [internalValue, setInternalValue] = React.useState(defaultValue);
    const currentValue = value ?? internalValue;
    
    const handleValueChange = React.useCallback((newValue: string) => {
        setInternalValue(newValue);
        onValueChange?.(newValue);
    }, [onValueChange]);
    
    return (
        <TabsContext.Provider value={{ value: currentValue, onValueChange: handleValueChange }}>
            <div className={cn('w-full', className)}>
                {children}
            </div>
        </TabsContext.Provider>
    );
}

interface TabsListProps {
    children: React.ReactNode;
    className?: string;
}

export function TabsList({ children, className }: TabsListProps) {
    return (
        <div className={cn(
            'flex flex-wrap gap-2 p-1 bg-[#F5F1E8] border-4 border-[#2C2416] rounded-none',
            className
        )}>
            {children}
        </div>
    );
}

interface TabsTriggerProps {
    value: string;
    children: React.ReactNode;
    className?: string;
    disabled?: boolean;
}

export function TabsTrigger({ value, children, className, disabled }: TabsTriggerProps) {
    const { value: selectedValue, onValueChange } = useTabsContext();
    const isSelected = selectedValue === value;
    
    return (
        <button
            type="button"
            role="tab"
            aria-selected={isSelected}
            disabled={disabled}
            onClick={() => onValueChange(value)}
            className={cn(
                'px-4 py-2 font-bold text-sm transition-all border-2 border-transparent',
                isSelected 
                    ? 'bg-[#2C2416] text-[#F5F1E8] border-[#2C2416] shadow-[3px_3px_0_rgba(44,36,22,0.5)]' 
                    : 'bg-white text-[#2C2416] hover:bg-[#F5C542] hover:border-[#2C2416]',
                disabled && 'opacity-50 cursor-not-allowed',
                className
            )}
        >
            {children}
        </button>
    );
}

interface TabsContentProps {
    value: string;
    children: React.ReactNode;
    className?: string;
}

export function TabsContent({ value, children, className }: TabsContentProps) {
    const { value: selectedValue } = useTabsContext();
    
    if (selectedValue !== value) return null;
    
    return (
        <div 
            role="tabpanel"
            className={cn('mt-4', className)}
        >
            {children}
        </div>
    );
}

// ============================================
// SELECT COMPONENT - Brutalist Style
// ============================================

interface SelectProps {
    value: string;
    onValueChange: (value: string) => void;
    children: React.ReactNode;
    placeholder?: string;
    className?: string;
    disabled?: boolean;
}

export function Select({ value, onValueChange, children, placeholder, className, disabled }: SelectProps) {
    const [open, setOpen] = React.useState(false);
    const selectRef = React.useRef<HTMLDivElement>(null);
    
    // Get options from children
    const options = React.Children.toArray(children).filter(
        (child): child is React.ReactElement<SelectOptionProps> => 
            React.isValidElement(child) && child.type === SelectOption
    );
    
    const selectedOption = options.find(opt => opt.props.value === value);
    
    // Close on outside click
    React.useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
                setOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);
    
    return (
        <div ref={selectRef} className={cn('relative', className)}>
            <button
                type="button"
                onClick={() => !disabled && setOpen(!open)}
                className={cn(
                    'w-full px-4 py-3 text-left font-medium bg-white border-4 border-[#2C2416]',
                    'shadow-[4px_4px_0_rgba(44,36,22,0.3)] transition-all',
                    'flex items-center justify-between gap-2',
                    open && 'shadow-[2px_2px_0_rgba(44,36,22,0.3)]',
                    disabled && 'opacity-50 cursor-not-allowed'
                )}
                disabled={disabled}
            >
                <span className={!selectedOption ? 'text-gray-400' : ''}>
                    {selectedOption?.props.children || placeholder || 'Select...'}
                </span>
                <svg 
                    className={cn('w-5 h-5 transition-transform', open && 'rotate-180')}
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
                </svg>
            </button>
            
            {open && (
                <div className="absolute z-50 w-full mt-1 bg-white border-4 border-[#2C2416] shadow-[4px_4px_0_rgba(44,36,22,0.3)] max-h-60 overflow-auto">
                    {options.map((option) => (
                        <button
                            key={option.props.value}
                            type="button"
                            onClick={() => {
                                onValueChange(option.props.value);
                                setOpen(false);
                            }}
                            className={cn(
                                'w-full px-4 py-2 text-left font-medium hover:bg-[#F5C542] transition-colors',
                                option.props.value === value && 'bg-[#F5C542]'
                            )}
                        >
                            {option.props.children}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}

interface SelectOptionProps {
    value: string;
    children: React.ReactNode;
}

export function SelectOption({ children }: SelectOptionProps) {
    return <>{children}</>;
}

// ============================================
// DIALOG/MODAL COMPONENT - Brutalist Style
// ============================================

interface DialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    children: React.ReactNode;
}

export function Dialog({ open, onOpenChange, children }: DialogProps) {
    React.useEffect(() => {
        if (open) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [open]);
    
    if (!open) return null;
    
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div 
                className="absolute inset-0 bg-black/60"
                onClick={() => onOpenChange(false)}
            />
            {/* Content */}
            <div className="relative z-10 w-full max-w-2xl max-h-[90vh] overflow-auto mx-4">
                {children}
            </div>
        </div>
    );
}

interface DialogContentProps {
    children: React.ReactNode;
    className?: string;
}

export function DialogContent({ children, className }: DialogContentProps) {
    return (
        <div className={cn(
            'bg-[#F5F1E8] border-4 border-[#2C2416] shadow-[8px_8px_0_rgba(44,36,22,0.4)] p-6',
            className
        )}>
            {children}
        </div>
    );
}

interface DialogHeaderProps {
    children: React.ReactNode;
    className?: string;
}

export function DialogHeader({ children, className }: DialogHeaderProps) {
    return (
        <div className={cn('mb-4', className)}>
            {children}
        </div>
    );
}

interface DialogTitleProps {
    children: React.ReactNode;
    className?: string;
}

export function DialogTitle({ children, className }: DialogTitleProps) {
    return (
        <h2 className={cn('text-2xl font-black text-[#2C2416]', className)}>
            {children}
        </h2>
    );
}

interface DialogFooterProps {
    children: React.ReactNode;
    className?: string;
}

export function DialogFooter({ children, className }: DialogFooterProps) {
    return (
        <div className={cn('mt-6 flex justify-end gap-3', className)}>
            {children}
        </div>
    );
}

// ============================================
// BADGE COMPONENT - Brutalist Style
// ============================================

interface BadgeProps {
    children: React.ReactNode;
    variant?: 'default' | 'success' | 'warning' | 'danger' | 'info';
    className?: string;
}

export function Badge({ children, variant = 'default', className }: BadgeProps) {
    const variants = {
        default: 'bg-[#F5C542] text-[#2C2416]',
        success: 'bg-green-400 text-green-900',
        warning: 'bg-orange-400 text-orange-900',
        danger: 'bg-red-400 text-red-900',
        info: 'bg-blue-400 text-blue-900',
    };
    
    return (
        <span className={cn(
            'inline-flex items-center px-2 py-1 text-xs font-bold border-2 border-[#2C2416]',
            variants[variant],
            className
        )}>
            {children}
        </span>
    );
}

// ============================================
// SWITCH/TOGGLE COMPONENT - Brutalist Style
// ============================================

interface SwitchProps {
    checked: boolean;
    onCheckedChange: (checked: boolean) => void;
    disabled?: boolean;
    className?: string;
}

export function Switch({ checked, onCheckedChange, disabled, className }: SwitchProps) {
    return (
        <button
            type="button"
            role="switch"
            aria-checked={checked}
            disabled={disabled}
            onClick={() => !disabled && onCheckedChange(!checked)}
            className={cn(
                'relative w-14 h-8 border-4 border-[#2C2416] transition-colors',
                checked ? 'bg-[#F5C542]' : 'bg-white',
                disabled && 'opacity-50 cursor-not-allowed',
                className
            )}
        >
            <span
                className={cn(
                    'absolute top-0.5 w-5 h-5 bg-[#2C2416] transition-transform',
                    checked ? 'translate-x-6' : 'translate-x-0.5'
                )}
            />
        </button>
    );
}

// ============================================
// LABEL COMPONENT
// ============================================

interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
    required?: boolean;
}

export function Label({ children, required, className, ...props }: LabelProps) {
    return (
        <label 
            className={cn('block font-bold text-[#2C2416] mb-1', className)}
            {...props}
        >
            {children}
            {required && <span className="text-red-500 ml-1">*</span>}
        </label>
    );
}

// ============================================
// ALERT COMPONENT - Brutalist Style
// ============================================

interface AlertProps {
    children: React.ReactNode;
    variant?: 'default' | 'success' | 'warning' | 'error' | 'info';
    className?: string;
}

export function Alert({ children, variant = 'default', className }: AlertProps) {
    const variants = {
        default: 'bg-[#F5F1E8] border-[#2C2416]',
        success: 'bg-green-100 border-green-600',
        warning: 'bg-orange-100 border-orange-600',
        error: 'bg-red-100 border-red-600',
        info: 'bg-blue-100 border-blue-600',
    };
    
    return (
        <div className={cn(
            'p-4 border-4 shadow-[4px_4px_0_rgba(44,36,22,0.2)]',
            variants[variant],
            className
        )}>
            {children}
        </div>
    );
}

// ============================================
// SKELETON LOADER - Brutalist Style
// ============================================

interface SkeletonProps {
    className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
    return (
        <div 
            className={cn(
                'animate-pulse bg-[#E5E0D8] border-2 border-[#2C2416]/20',
                className
            )}
        />
    );
}

// ============================================
// TOOLTIP COMPONENT
// ============================================

interface TooltipProps {
    content: string;
    children: React.ReactNode;
    className?: string;
}

export function Tooltip({ content, children, className }: TooltipProps) {
    const [show, setShow] = React.useState(false);
    
    return (
        <div 
            className={cn('relative inline-block', className)}
            onMouseEnter={() => setShow(true)}
            onMouseLeave={() => setShow(false)}
        >
            {children}
            {show && (
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1 bg-[#2C2416] text-white text-sm font-medium whitespace-nowrap z-50">
                    {content}
                    <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-[#2C2416]" />
                </div>
            )}
        </div>
    );
}
