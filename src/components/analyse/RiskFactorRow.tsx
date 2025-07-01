
import React, { useState } from 'react';

interface Option {
    label: string;
    value: number;
}

interface RiskFactor {
    id: string;
    label: string;
    analyse: string;
    ponderation: number;
    options: Option[];
    selection: number; // index of the selected option
    score: number;
}

interface RiskFactorRowProps {
    factor: RiskFactor;
    factorKey: string;
    onSelectionChange: (factorKey: string, selectionIndex: number) => void;
}

const RiskFactorRow: React.FC<RiskFactorRowProps> = ({ factor, factorKey, onSelectionChange }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <div className="grid grid-cols-12 col-span-12 border-t border-gray-200">
                <div className="col-span-1 p-2 border-r border-gray-200 flex items-center justify-center">{factor.id}</div>
                <div className="col-span-5 p-2 border-r border-gray-200 flex items-center">{factor.label}</div>
                <div className="col-span-2 p-2 border-r border-gray-200 flex items-center justify-center">
                    <button onClick={() => setIsOpen(!isOpen)} className="text-blue-600 hover:underline text-xs">
                        {isOpen ? 'Masquer' : 'Afficher'} analyse
                    </button>
                </div>
                <div className="col-span-2 p-1 border-r border-gray-200">
                    <select
                        value={factor.selection}
                        onChange={(e) => onSelectionChange(factorKey, parseInt(e.target.value, 10))}
                        className="w-full p-1 text-xs border rounded-md bg-white"
                    >
                        <option value="-1" disabled>Sélectionner...</option>
                        {factor.options.map((opt, index) => (
                            <option key={index} value={index}>
                                {opt.label}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="col-span-1 p-2 border-r border-gray-200 flex items-center justify-center font-semibold">{factor.score.toFixed(2)}%</div>
                <div className="col-span-1 p-2 flex items-center justify-center font-semibold bg-gray-100">{factor.ponderation}%</div>
            </div>
            {isOpen && (
                <div className="col-span-12 p-3 bg-indigo-50 border-t border-gray-200">
                    <p className="text-xs text-gray-700 whitespace-pre-wrap">{factor.analyse}</p>
                </div>
            )}
        </>
    );
};

export default RiskFactorRow;