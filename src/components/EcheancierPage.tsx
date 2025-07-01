

import React, { useMemo } from 'react';
import { CreditApplicationData, EcheancierRow } from '../types.ts';

interface EcheancierPageProps {
  formData: CreditApplicationData;
  setFormData: React.Dispatch<React.SetStateAction<CreditApplicationData>>;
  onNext: () => void;
  isReadOnly?: boolean;
}

const FormCell = ({ children, className = '', colSpan = 1, rowSpan = 1, isHeader = false, isSubHeader = false, isTitle = false, isLabel = false, align = 'center', style: customStyle }: { children: any, className?: string, colSpan?: number, rowSpan?: number, isHeader?: boolean, isSubHeader?: boolean, isTitle?: boolean, isLabel?: boolean, align?: string, style?: React.CSSProperties }) => {
    const baseClasses = 'border border-gray-400 p-1 text-xs flex items-center';
    const bgClasses = isTitle ? 'bg-yellow-400 font-bold' : isHeader ? 'bg-gray-200 font-semibold' : isSubHeader ? 'bg-gray-100 font-semibold' : 'bg-white';
    const alignClasses = `justify-${align}`;
    const style = {
        gridColumn: `span ${colSpan} / span ${colSpan}`,
        gridRow: `span ${rowSpan} / span ${rowSpan}`,
        ...customStyle
    };
    return <div style={style} className={`${baseClasses} ${bgClasses} ${className} ${alignClasses}`}>{children}</div>;
};

const InputField = ({ value, onChange, name = '', type = 'text', className = '', readOnly = false, ...rest }: { value: any, onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void, name?: string, type?: string, className?: string, readOnly?: boolean, [x:string]: any }) => (
    <input type={type} name={name} value={value ?? ''} onChange={onChange} readOnly={readOnly} className={`w-full h-full bg-transparent outline-none text-xs px-1 ${readOnly ? 'text-right bg-gray-100 cursor-not-allowed' : ''} ${className}`} {...rest} />
);


const EcheancierPage: React.FC<EcheancierPageProps> = ({ formData, setFormData, onNext, isReadOnly = false }) => {
    const { echeancier } = formData;

    const handleParamChange = (field: 'montantPrete' | 'duree' | 'tauxAnnuel', value: string) => {
        if (isReadOnly) return;
        setFormData(prev => ({
            ...prev,
            echeancier: {
                ...prev.echeancier,
                [field]: parseFloat(value) || 0
            }
        }));
    };

    const calculatedSchedule = useMemo(() => {
        const { montantPrete, duree, tauxAnnuel } = echeancier;
        const newSchedule: EcheancierRow[] = Array(84).fill(null).map((_, i) => ({
            mois: i + 1,
            capitalRestantDu: 0,
            rembtCapital: 0,
            rembtInteret: 0,
            echeance: 0,
        }));
        
        if (montantPrete > 0 && duree > 0 && tauxAnnuel > 0) {
            const tauxMensuel = (tauxAnnuel / 100) / 12;
            const echeanceConstante = montantPrete * (tauxMensuel * Math.pow(1 + tauxMensuel, duree)) / (Math.pow(1 + tauxMensuel, duree) - 1);
            
            let capitalRestant = montantPrete;

            for (let i = 0; i < duree && i < 84; i++) {
                const interet = capitalRestant * tauxMensuel;
                const capitalRembourse = echeanceConstante - interet;
                
                newSchedule[i] = {
                    mois: i + 1,
                    capitalRestantDu: capitalRestant,
                    rembtCapital: capitalRembourse,
                    rembtInteret: interet,
                    echeance: echeanceConstante,
                };
                
                capitalRestant -= capitalRembourse;
            }
        }
        
        return newSchedule;
    }, [echeancier.montantPrete, echeancier.duree, echeancier.tauxAnnuel]);
    
    const tauxMensuelCalc = useMemo(() => (echeancier.tauxAnnuel / 12 / 100), [echeancier.tauxAnnuel]);
    const echeanceCalc = useMemo(() => calculatedSchedule.length > 0 && calculatedSchedule[0].echeance > 0 ? calculatedSchedule[0].echeance : 0, [calculatedSchedule]);
    
    const totals = useMemo(() => {
        return calculatedSchedule.reduce((acc, row) => {
            if(row.echeance > 0) { // Only sum up rows that are part of the actual schedule
              acc.rembtCapital += row.rembtCapital;
              acc.rembtInteret += row.rembtInteret;
              acc.echeance += row.echeance;
            }
            return acc;
        }, { rembtCapital: 0, rembtInteret: 0, echeance: 0 });
    }, [calculatedSchedule]);

    const renderScheduleRow = (row: EcheancierRow) => (
        <React.Fragment key={row.mois}>
            <FormCell>{row.mois}</FormCell>
            <FormCell align="right">{row.capitalRestantDu > 0 ? Math.round(row.capitalRestantDu).toLocaleString() : '0'}</FormCell>
            <FormCell align="right">{row.rembtCapital > 0 ? Math.round(row.rembtCapital).toLocaleString() : '0'}</FormCell>
            <FormCell align="right">{row.rembtInteret > 0 ? Math.round(row.rembtInteret).toLocaleString() : '0'}</FormCell>
            <FormCell align="right">{row.echeance > 0 ? Math.round(row.echeance).toLocaleString() : '0'}</FormCell>
        </React.Fragment>
    );

    return (
        <div className="bg-white p-4 rounded-lg text-sm">
            {/* Header */}
            <div className="grid grid-cols-24 gap-0 mb-2">
                <FormCell colSpan={3} isHeader align="left">Affaire</FormCell>
                <FormCell colSpan={5} isSubHeader align="left">{formData.affaire}</FormCell>
                <FormCell colSpan={8} isHeader className="text-center font-bold text-base" style={{backgroundColor: '#C4A484'}}>Echeancier</FormCell>
                <FormCell colSpan={8} isHeader className="text-right font-bold">Dossier {formData.dossier}</FormCell>
                <FormCell colSpan={24} className="bg-red-200 text-red-800 text-center font-semibold">Cocher la case "ECHEANCIER" pour voir le détail des calculs</FormCell>
            </div>
            
             {/* Parametres */}
            <div className="grid grid-cols-5 gap-4 mb-4">
                <div className="flex flex-col space-y-1">
                    <label className="font-semibold text-xs">Montant prêté (FCFA)</label>
                    <InputField type="number" value={String(echeancier.montantPrete)} onChange={e => handleParamChange('montantPrete', e.target.value)} className="border border-gray-300 rounded text-right" readOnly={isReadOnly}/>
                </div>
                <div className="flex flex-col space-y-1">
                    <label className="font-semibold text-xs">Durée (mois)</label>
                    <InputField type="number" value={String(echeancier.duree)} onChange={e => handleParamChange('duree', e.target.value)} className="border border-gray-300 rounded text-right" readOnly={isReadOnly}/>
                </div>
                 <div className="flex flex-col space-y-1">
                    <label className="font-semibold text-xs">Taux annuel (%)</label>
                    <InputField type="number" value={String(echeancier.tauxAnnuel)} onChange={e => handleParamChange('tauxAnnuel', e.target.value)} className="border border-gray-300 rounded text-right" readOnly={isReadOnly}/>
                </div>
                <div className="flex flex-col space-y-1">
                    <label className="font-semibold text-xs">Taux mensuel (%)</label>
                    <div className="p-1 border border-gray-300 rounded text-right bg-gray-100 h-full flex items-center justify-end">{(tauxMensuelCalc * 100).toFixed(2)}%</div>
                </div>
                <div className="flex flex-col space-y-1">
                    <label className="font-semibold text-xs">Echéance (FCFA)</label>
                    <div className="p-1 border border-gray-300 rounded text-right bg-gray-100 h-full flex items-center justify-end">{echeanceCalc > 0 ? Math.round(echeanceCalc).toLocaleString() : '0'}</div>
                </div>
            </div>

            {/* Echéancier Table */}
            <div className="grid grid-cols-5 gap-0 mb-4 border-t-2 border-black max-h-96 overflow-y-auto">
                {/* Headers */}
                <FormCell isHeader>Mois</FormCell>
                <FormCell isHeader>Capital Restant Dû</FormCell>
                <FormCell isHeader>Rembt Capital</FormCell>
                <FormCell isHeader>Rembt Intérêt</FormCell>
                <FormCell isHeader>Echéance</FormCell>

                {/* Body */}
                {calculatedSchedule.map(row => renderScheduleRow(row))}

                {/* Totals */}
                <FormCell isHeader>TOTAL</FormCell>
                <FormCell isHeader>{''}</FormCell>
                <FormCell isHeader align="right">{Math.round(totals.rembtCapital).toLocaleString()}</FormCell>
                <FormCell isHeader align="right">{Math.round(totals.rembtInteret).toLocaleString()}</FormCell>
                <FormCell isHeader align="right">{Math.round(totals.echeance).toLocaleString()}</FormCell>
            </div>


            {!isReadOnly && (
                <div className="flex justify-end mt-6">
                    <button type="button" onClick={onNext} className="bg-blue-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-200">
                        Enregistrer et Suivant
                    </button>
                </div>
            )}
        </div>
    );
};

export default EcheancierPage;
