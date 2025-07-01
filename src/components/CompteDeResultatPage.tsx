

import React, { useMemo } from 'react';
import { CreditApplicationData, CompteDeResultatData, CompteDeResultatValue } from '../types.ts';

interface CompteDeResultatPageProps {
  formData: CreditApplicationData;
  setFormData: React.Dispatch<React.SetStateAction<CreditApplicationData>>;
  onNext: () => void;
  isReadOnly?: boolean;
}

// Discriminated union types for rowLayout
interface RowDataItem {
    label: string;
    ref: string;
    sub?: string;
    key?: keyof CompteDeResultatData['values'];
    isCalc?: boolean;
    calcKey?: string;
    isTotal?: boolean;
    isSubText?: boolean;
}

type HeaderRow = { type: 'header'; left: string; right: string; };
type DataRow = { type: 'data'; left: RowDataItem | { label?: string; isSubText?: boolean; } | {}; right: RowDataItem | {}; };
type SpacerRow = { type: 'spacer'; };
type FinalTotalsRow = { type: 'finalTotals'; };
type LayoutRow = HeaderRow | DataRow | SpacerRow | FinalTotalsRow;


const FormCell = ({ children, className = '', colSpan = 1, rowSpan = 1, isHeader = false, isSubHeader = false, isCalculated = false, align = 'start', isTitle = false, isTotal = false }: { children: React.ReactNode, className?: string, colSpan?: number, rowSpan?: number, isHeader?: boolean, isSubHeader?: boolean, isCalculated?: boolean, align?: 'start' | 'center' | 'end', isTitle?: boolean, isTotal?: boolean }) => {
    const baseClasses = 'border border-black p-1 text-xs flex items-center';
    const bgClasses = isTitle ? 'bg-gray-700 text-white font-bold' : isTotal ? 'bg-gray-300 font-bold' : isHeader ? 'bg-gray-200 font-semibold' : isSubHeader ? 'bg-gray-100 font-semibold' : isCalculated ? 'bg-gray-300 font-semibold' : 'bg-white';
    const alignClass = `justify-${align}`;
    const style: React.CSSProperties = { 
        gridColumn: `span ${colSpan} / span ${colSpan}`, 
        gridRow: `span ${rowSpan} / span ${rowSpan}`,
        textAlign: align === 'end' ? 'right' : align === 'center' ? 'center' : 'left'
    };
    return <div style={style} className={`${baseClasses} ${bgClasses} ${className} ${alignClass}`}>{children}</div>;
};

const InputField = ({ value, onChange, type = 'text', readOnly = false, className = '' }: { value: any, onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void, type?: string, readOnly?: boolean, className?: string }) => (
    <input type={type} value={value ?? ''} onChange={onChange} readOnly={readOnly} className={`w-full h-full bg-transparent outline-none text-xs px-1 ${className} ${readOnly ? 'font-semibold' : ''}`} />
);

const CompteDeResultatPage: React.FC<CompteDeResultatPageProps> = ({ formData, setFormData, onNext, isReadOnly = false }) => {
    const { compteDeResultat } = formData;
    
    const handleValueChange = (key: keyof CompteDeResultatData['values'], subField: 'exerciceN' | 'exerciceN1', value: string) => {
        if (isReadOnly) return;
        setFormData(prev => ({
            ...prev,
            compteDeResultat: {
                ...prev.compteDeResultat,
                values: {
                    ...prev.compteDeResultat.values,
                    [key]: {
                        ...prev.compteDeResultat.values[key],
                        [subField]: parseFloat(value) || 0,
                    }
                }
            }
        }));
    };
    
    const handleDateChange = (field: 'exerciceN' | 'exerciceN1', value: string) => {
        if (isReadOnly) return;
        setFormData(prev => ({
            ...prev,
            compteDeResultat: { ...prev.compteDeResultat, dates: { ...prev.compteDeResultat.dates, [field]: value } }
        }));
    };

    const handleNbMoisChange = (field: 'exerciceN' | 'exerciceN1', value: string) => {
        if (isReadOnly) return;
        const numValue = parseInt(value, 10) || 0;
        setFormData(prev => ({
            ...prev,
            compteDeResultat: { ...prev.compteDeResultat, nbMois: { ...prev.compteDeResultat.nbMois, [field]: numValue } }
        }));
    };

    const calculations = useMemo(() => {
        const v = compteDeResultat?.values;

        if (!v) {
            const zeroVal = { exerciceN: 0, exerciceN1: 0 };
            const keys = ['RW', 'TW', 'TX', 'SF', 'UF', 'UG', 'SH', 'UH', 'UI', 'SO', 'UO', 'UP', 'ST', 'UT', 'UZ'];
            const res: { [key: string]: CompteDeResultatValue } = {};
            keys.forEach(k => res[k] = zeroVal);
            return res;
        }

        const res: { [key: string]: CompteDeResultatValue } = {};
        const calc = (keys: (keyof typeof v)[], signs: number[] = []) => ({
            exerciceN: keys.reduce((s, k, i) => s + (v[k]?.exerciceN || 0) * (signs[i] || 1), 0),
            exerciceN1: keys.reduce((s, k, i) => s + (v[k]?.exerciceN1 || 0) * (signs[i] || 1), 0),
        });

        // Exploitation
        res.RW = calc(['RA', 'RB', 'RC', 'RD', 'RE', 'RH', 'RI', 'RJ', 'RK', 'RL', 'RP', 'RQ', 'RS']);
        res.TW = calc(['TA', 'TC', 'TD', 'TE', 'TF', 'TH', 'TS', 'TT']);
        res.TX = { exerciceN: res.TW.exerciceN - res.RW.exerciceN, exerciceN1: res.TW.exerciceN1 - res.RW.exerciceN1 };

        // Financier
        res.SF = calc(['SA', 'SC', 'SD']);
        res.UF = calc(['UA', 'UC', 'UD', 'UE']);
        res.UG = { exerciceN: res.UF.exerciceN - res.SF.exerciceN, exerciceN1: res.UF.exerciceN1 - res.SF.exerciceN1 };

        // Activités ordinaires
        res.SH = { exerciceN: res.RW.exerciceN + res.SF.exerciceN, exerciceN1: res.RW.exerciceN1 + res.SF.exerciceN1 };
        res.UH = { exerciceN: res.TW.exerciceN + res.UF.exerciceN, exerciceN1: res.TW.exerciceN1 + res.UF.exerciceN1 };
        res.UI = { exerciceN: res.TX.exerciceN + res.UG.exerciceN, exerciceN1: res.TX.exerciceN1 + res.UG.exerciceN1 };

        // H.A.O
        res.SO = calc(['SK', 'SL', 'SM']);
        res.UO = calc(['UK', 'UL', 'UM', 'UN']);
        res.UP = { exerciceN: res.UO.exerciceN - res.SO.exerciceN, exerciceN1: res.UO.exerciceN1 - res.SO.exerciceN1 };

        // Totaux & Résultat Net
        res.ST = { exerciceN: res.SH.exerciceN + res.SO.exerciceN + (v.SQ?.exerciceN || 0) + (v.SR?.exerciceN || 0), exerciceN1: res.SH.exerciceN1 + res.SO.exerciceN1 + (v.SQ?.exerciceN1 || 0) + (v.SR?.exerciceN1 || 0) };
        res.UT = { exerciceN: res.UH.exerciceN + res.UO.exerciceN, exerciceN1: res.UH.exerciceN1 + res.UO.exerciceN1 };
        res.UZ = { exerciceN: res.UT.exerciceN - res.ST.exerciceN, exerciceN1: res.UT.exerciceN1 - res.ST.exerciceN1 };

        return res;
    }, [compteDeResultat]);
    
    const rowLayout: LayoutRow[] = [
        { type: 'header', left: "ACTIVITE D'EXPLOITATION", right: "ACTIVITE D'EXPLOITATION" },
        { type: 'data', left: { label: 'Achat de marchandises', ref: 'RA', key: 'RA' }, right: { label: 'Ventes de marchandises', ref: 'TA', key: 'TA' } },
        { type: 'data', left: { label: 'Variation de stocks', sub: '(+ ou -)', ref: 'RB', key: 'RB' }, right: { label: 'Ventes de produits fabriqués', ref: 'TC', key: 'TC' } },
        { type: 'data', left: { label: 'Achat de matières premières et fournitures liées', ref: 'RC', key: 'RC' }, right: { label: 'Travaux, services vendus', ref: 'TD', key: 'TD' } },
        { type: 'data', left: { label: 'Variation de stocks', sub: '(+ ou -)', ref: 'RD', key: 'RD' }, right: { label: 'Production stockée (ou déstockage)', sub: '(+ ou -)', ref: 'TE', key: 'TE' } },
        { type: 'data', left: { label: 'Autres achats', ref: 'RE', key: 'RE' }, right: { label: 'Production immobilisée', ref: 'TF', key: 'TF' } },
        { type: 'data', left: { label: 'Transports', ref: 'RI', key: 'RI' }, right: { label: 'Produits accessoires', ref: 'TH', key: 'TH' } },
        { type: 'data', left: { label: 'Services extérieurs', ref: 'RJ', key: 'RJ' }, right: { label: 'Reprises de provisions', ref: 'TS', key: 'TS' } },
        { type: 'data', left: { label: 'Impôts et taxes', ref: 'RK', key: 'RK' }, right: { label: 'Transferts de charges', ref: 'TT', key: 'TT' } },
        { type: 'data', left: { label: 'Autres charges', ref: 'RL', key: 'RL' }, right: { label: "Total des produits d'exploitation", ref: 'TW', isCalc: true, calcKey: 'TW' } },
        { type: 'data', left: { label: 'Charges de personnel (1)', ref: 'RP', key: 'RP' }, right: { label: "Résultat d'exploitation", sub: 'Bénéfice (+); Perte (-)', ref: 'TX', isCalc: true, calcKey: 'TX', isTotal: true } },
        { type: 'data', left: { label: '(1) dont personnel extérieur...', ref: 'RQ', key: 'RQ' }, right: {} },
        { type: 'data', left: { label: 'Dotations aux amortissements et aux provisions', ref: 'RS', key: 'RS' }, right: {} },
        { type: 'data', left: { label: "Total des charges d'exploitation", ref: 'RW', isCalc: true, calcKey: 'RW' }, right: {} },
        { type: 'data', left: { label: "(Résultat d'exploitation voir TX)", isSubText: true}, right: {}},

        { type: 'spacer' },
        { type: 'header', left: 'ACTIVITES FINANCIERES', right: 'ACTIVITES FINANCIERES' },
        { type: 'data', left: { label: 'Frais financiers', ref: 'SA', key: 'SA' }, right: { label: 'Revenus financiers', ref: 'UA', key: 'UA' } },
        { type: 'data', left: { label: 'Pertes de change', ref: 'SC', key: 'SC' }, right: { label: 'Gains de change', ref: 'UC', key: 'UC' } },
        { type: 'data', left: { label: 'Dotations aux amortissements et aux provisions', ref: 'SD', key: 'SD' }, right: { label: 'Reprises de provisions', ref: 'UD', key: 'UD' } },
        { type: 'data', left: { label: 'Total des charges financières', ref: 'SF', isCalc: true, calcKey: 'SF' }, right: { label: 'Transferts de charges', ref: 'UE', key: 'UE' } },
        { type: 'data', left: { label: '(Résultat financier voir UG)', isSubText: true }, right: { label: 'Total des produits financiers', ref: 'UF', isCalc: true, calcKey: 'UF' } },
        { type: 'data', left: {}, right: { label: 'Résultat financier (+ ou -)', ref: 'UG', isCalc: true, calcKey: 'UG', isTotal: true } },

        { type: 'spacer' },
        { type: 'data', left: { label: "Total des charges des activités ordinaires", ref: 'SH', isCalc: true, calcKey: 'SH' }, right: { label: 'Total des produits des activités ordinaires', ref: 'UH', isCalc: true, calcKey: 'UH' } },
        { type: 'data', left: { label: '(Résultat des activités ordinaires voir UI)', isSubText: true }, right: { label: 'Résultat des activités ordinaires (1) (+ ou -)', ref: 'UI', isCalc: true, calcKey: 'UI', isTotal: true } },
        { type: 'data', left: {}, right: { label: '(1) dont impôt correspondant', ref: 'UJ', key: 'UJ' } },

        { type: 'spacer' },
        { type: 'header', left: 'HORS ACTIVITES ORDINAIRES (H.A.O)', right: 'HORS ACTIVITES ORDINAIRES (H.A.O)' },
        { type: 'data', left: { label: "Valeurs comptables des cessions d'immobilisations", ref: 'SK', key: 'SK' }, right: { label: "Produits des cessions d'immobilisations", ref: 'UK', key: 'UK' } },
        { type: 'data', left: { label: 'Charges H.A.O', ref: 'SL', key: 'SL' }, right: { label: 'Produits H.A.O', ref: 'UL', key: 'UL' } },
        { type: 'data', left: { label: 'Dotations H.A.O', ref: 'SM', key: 'SM' }, right: { label: 'Reprises H.A.O', ref: 'UM', key: 'UM' } },
        { type: 'data', left: {}, right: { label: 'Transferts de charges', ref: 'UN', key: 'UN' } },
        { type: 'data', left: { label: 'Total des charges H.A.O', ref: 'SO', isCalc: true, calcKey: 'SO' }, right: { label: 'Total des produits H.A.O', ref: 'UO', isCalc: true, calcKey: 'UO' } },
        { type: 'data', left: { label: '(Résultat H.A.O voir UP)', isSubText: true }, right: { label: 'Résultat H.A.O (+ ou -)', ref: 'UP', isCalc: true, calcKey: 'UP', isTotal: true } },

        { type: 'spacer' },
        { type: 'data', left: { label: 'Participation des travailleurs', ref: 'SQ', key: 'SQ' }, right: {} },
        { type: 'data', left: { label: 'Impôts sur le résultat', ref: 'SR', key: 'SR' }, right: {} },
        { type: 'finalTotals' },
    ];
    
    const renderSide = (side: RowDataItem | { label?: string; isSubText?: boolean; } | {}) => {
        if (!side || !('label' in side)) {
            return <FormCell colSpan={7}>{''}</FormCell>;
        }

        if ('isSubText' in side && side.isSubText === true) {
            return <FormCell colSpan={7} align="center" className="italic text-gray-600">{side.label}</FormCell>;
        }

        // After the check above, we can assume it's a RowDataItem if it has a `ref`.
        if ('ref' in side) {
            const item = side as RowDataItem;
            const { label, ref, sub, key, isCalc, calcKey, isTotal } = item;
            
            const value = isCalc ? calculations[calcKey!] : (key ? compteDeResultat?.values?.[key] : null);
    
            return (
                <React.Fragment>
                    <FormCell colSpan={4} isTotal={isTotal} align="start">{label} {sub && <i className="ml-1 text-xs">{sub}</i>}</FormCell>
                    <FormCell colSpan={1} isTotal={isTotal} align="center">{ref || ''}</FormCell>
                    {value ? (
                        <>
                        <FormCell colSpan={1} isCalculated={isCalc} isTotal={isTotal} className="!p-0" align="end">
                            <InputField 
                                value={isCalc ? (value as CompteDeResultatValue).exerciceN.toLocaleString() : String((value as CompteDeResultatValue).exerciceN)} 
                                readOnly={isCalc || isReadOnly}
                                onChange={!isCalc && !isReadOnly ? e => handleValueChange(key!, 'exerciceN', e.target.value) : undefined}
                            />
                        </FormCell>
                        <FormCell colSpan={1} isCalculated={isCalc} isTotal={isTotal} className="!p-0" align="end">
                            <InputField 
                                value={isCalc ? (value as CompteDeResultatValue).exerciceN1.toLocaleString() : String((value as CompteDeResultatValue).exerciceN1)} 
                                readOnly={isCalc || isReadOnly}
                                onChange={!isCalc && !isReadOnly ? e => handleValueChange(key!, 'exerciceN1', e.target.value) : undefined}
                            />
                        </FormCell>
                        </>
                    ) : (
                        <FormCell colSpan={2} isTotal={isTotal}>{''}</FormCell>
                    )}
                </React.Fragment>
            );
        }
        
        return <FormCell colSpan={7}>{''}</FormCell>;
    };

    return (
        <div className="bg-white p-4 rounded-lg text-sm">
            <div className="grid grid-cols-24 gap-0 mb-4">
                <FormCell colSpan={8} align="start" className="!border-none !bg-yellow-400 !text-black font-bold">Affaire: {formData.affaire}</FormCell>
                <FormCell colSpan={8} align="center" className="!border-none !bg-gray-200">En KFCFA (milliers)</FormCell>
                <FormCell colSpan={8} align="end" className="!border-none !bg-yellow-400 !text-black font-bold">Dossier: {formData.dossier}</FormCell>
                <FormCell colSpan={24} align="center" isTitle className="!border-none">COMPTE DE RESULTAT - SYSTÈME NORMAL</FormCell>
                
                <div className="col-span-24 grid grid-cols-24 gap-0 border border-black my-2">
                    <FormCell colSpan={6} className="!border-none text-red-600 !justify-end">Dates, à renseigner obligatoirement {'=>'}</FormCell>
                    <FormCell colSpan={3} className="!p-0"><InputField type="date" value={compteDeResultat.dates.exerciceN} onChange={e => handleDateChange('exerciceN', e.target.value)} readOnly={isReadOnly} className="text-center font-bold" /></FormCell>
                    <FormCell colSpan={3} className="!p-0"><InputField type="date" value={compteDeResultat.dates.exerciceN1} onChange={e => handleDateChange('exerciceN1', e.target.value)} readOnly={isReadOnly} className="text-center font-bold" /></FormCell>

                    <FormCell colSpan={6} className="!border-none text-red-600 !justify-end">Nb de mois de l'exercice, à renseigner obligatoirement {'=>'}</FormCell>
                    <FormCell colSpan={3} className="!p-0"><InputField type="number" value={compteDeResultat.nbMois.exerciceN} onChange={e => handleNbMoisChange('exerciceN', e.target.value)} readOnly={isReadOnly} className="text-center font-bold" /></FormCell>
                    <FormCell colSpan={3} className="!p-0"><InputField type="number" value={compteDeResultat.nbMois.exerciceN1} onChange={e => handleNbMoisChange('exerciceN1', e.target.value)} readOnly={isReadOnly} className="text-center font-bold" /></FormCell>
                </div>
            </div>
            
             <div className="grid grid-cols-14 gap-0">
                {/* Headers */}
                <FormCell colSpan={7} isHeader align="center">CHARGES</FormCell>
                <FormCell colSpan={7} isHeader align="center">PRODUITS</FormCell>
                
                <div style={{ gridColumn: 'span 7' }} className="grid grid-cols-7 gap-0 border-r border-black">
                    <FormCell colSpan={4} isSubHeader>{''}</FormCell>
                    <FormCell colSpan={1} isSubHeader align="center">Réf.</FormCell>
                    <FormCell colSpan={1} isSubHeader align="center">Exercice N</FormCell>
                    <FormCell colSpan={1} isSubHeader align="center">Exercice (N-1)</FormCell>
                </div>
                <div style={{ gridColumn: 'span 7' }} className="grid grid-cols-7 gap-0">
                    <FormCell colSpan={4} isSubHeader>{''}</FormCell>
                    <FormCell colSpan={1} isSubHeader align="center">Réf.</FormCell>
                    <FormCell colSpan={1} isSubHeader align="center">Exercice N</FormCell>
                    <FormCell colSpan={1} isSubHeader align="center">Exercice (N-1)</FormCell>
                </div>

                {rowLayout.map((row, index) => {
                    if (row.type === 'header') {
                        return (
                            <React.Fragment key={index}>
                                <div style={{ gridColumn: 'span 7' }} className="grid grid-cols-7 gap-0 border-r border-black">
                                    <FormCell colSpan={7} isHeader align="start">{row.left}</FormCell>
                                </div>
                                <div style={{ gridColumn: 'span 7' }} className="grid grid-cols-7 gap-0">
                                     <FormCell colSpan={7} isHeader align="start">{row.right}</FormCell>
                                </div>
                            </React.Fragment>
                        );
                    }
                     if (row.type === 'spacer') {
                        return <FormCell colSpan={14} key={index} className="!border-none h-2 bg-white">{''}</FormCell>;
                    }
                    if (row.type === 'finalTotals') {
                        return (
                            <React.Fragment key={index}>
                                <div style={{ gridColumn: 'span 7' }} className="grid grid-cols-7 gap-0 border-r border-black">
                                    {renderSide({ label: 'TOTAL GENERAL DES CHARGES', ref: 'ST', isCalc: true, calcKey: 'ST', isTotal: true })}
                                </div>
                                <div style={{ gridColumn: 'span 7' }} className="grid grid-cols-7 gap-0">
                                     {renderSide({ label: 'TOTAL GENERAL DES PRODUITS', ref: 'UT', isCalc: true, calcKey: 'UT', isTotal: true })}
                                </div>
                                <div style={{ gridColumn: 'span 7' }} className="grid grid-cols-7 gap-0 border-r border-black">
                                    {renderSide({ label: '(Résultat net voir UZ)', isSubText: true })}
                                </div>
                                <div style={{ gridColumn: 'span 7' }} className="grid grid-cols-7 gap-0">
                                    {renderSide({ label: 'RESULTAT NET', sub: 'Bénéfice (+); Perte (-)', ref: 'UZ', isCalc: true, calcKey: 'UZ', isTotal: true })}
                                </div>
                            </React.Fragment>
                        )
                    }
                    
                    return (
                        <React.Fragment key={index}>
                           <div style={{ gridColumn: 'span 7' }} className="grid grid-cols-7 gap-0 border-r border-black">
                             {renderSide(row.left)}
                           </div>
                           <div style={{ gridColumn: 'span 7' }} className="grid grid-cols-7 gap-0">
                             {renderSide(row.right)}
                           </div>
                        </React.Fragment>
                    );
                })}
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

export default CompteDeResultatPage;