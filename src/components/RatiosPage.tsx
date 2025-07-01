

import React from 'react';
import { CreditApplicationData, RatiosData } from '../types.ts';

interface RatiosPageProps {
  formData: CreditApplicationData;
  setFormData: React.Dispatch<React.SetStateAction<CreditApplicationData>>;
  onNext: () => void;
  isReadOnly?: boolean;
}

const FormCell = ({ children, className = '', colSpan = 1, rowSpan = 1, isHeader = false, isTitle = false, isLabel = false }: { children: any, className?: string, colSpan?: number, rowSpan?: number, isHeader?: boolean, isTitle?: boolean, isLabel?: boolean }) => {
    const baseClasses = 'border border-black p-1 text-xs flex items-center';
    const bgClasses = isTitle ? 'bg-yellow-400 font-bold' : isHeader ? 'bg-gray-200 font-semibold' : 'bg-white';
    const alignClasses = isLabel ? 'justify-start' : 'justify-center';
    const style = {
        gridColumn: `span ${colSpan} / span ${colSpan}`,
        gridRow: `span ${rowSpan} / span ${rowSpan}`,
    };
    return <div style={style} className={`${baseClasses} ${bgClasses} ${className} ${alignClasses}`}>{children}</div>;
};

const InputField = ({ value, onChange, name = '', type = 'text', className = '', readOnly = false, placeholder = '' }) => (
    <input type={type} name={name} value={value ?? ''} onChange={onChange} readOnly={readOnly} placeholder={placeholder} className={`w-full h-full bg-transparent outline-none text-xs px-1 text-right ${readOnly ? 'bg-gray-100 cursor-not-allowed' : ''} ${className}`} />
);

const TextAreaField = ({ value, onChange, name, className = '', rows = 2, readOnly = false }) => (
    <textarea name={name} value={value ?? ''} onChange={onChange} rows={rows} readOnly={readOnly} className={`w-full h-full bg-transparent outline-none text-xs p-1 ${readOnly ? 'bg-gray-100 cursor-not-allowed' : ''} ${className}`} />
);

const RatiosPage: React.FC<RatiosPageProps> = ({ formData, setFormData, onNext, isReadOnly = false }) => {
    const { ratios } = formData;

    const handleDateChange = (field: 'annee1' | 'annee2', value: string) => {
        if (isReadOnly) return;
        setFormData(prev => ({
            ...prev,
            ratios: {
                ...prev.ratios,
                dates: {
                    ...prev.ratios.dates,
                    [field]: value
                }
            }
        }))
    };
    
    const handleControlChange = (section: keyof RatiosData['controles'], field: 'annee1' | 'annee2', value: any) => {
        if (isReadOnly) return;
        const finalValue = typeof ratios.controles[section][field] === 'number' ? parseInt(value, 10) || 0 : value;
        setFormData(prev => ({
            ...prev,
            ratios: {
                ...prev.ratios,
                controles: {
                    ...prev.ratios.controles,
                    [section]: {
                       ...prev.ratios.controles[section],
                       [field]: finalValue
                    }
                }
            }
        }));
    };
    
    const handleValueChange = (section: keyof Omit<RatiosData, 'controles' | 'dates' | 'syntheseFinanciere' | 'commentaires'>, key: string, field: 'annee1' | 'annee2', value: string) => {
        if (isReadOnly) return;
        setFormData(prev => {
            const fieldType = typeof prev.ratios[section][key][field];
            const finalValue = fieldType === 'number' ? parseFloat(value) || 0 : value;

            return {
                ...prev,
                ratios: {
                    ...prev.ratios,
                    [section]: {
                        ...prev.ratios[section],
                        [key]: {
                            ...prev.ratios[section][key],
                            [field]: finalValue
                        }
                    }
                }
            }
        });
    };
    
    const handleTextChange = (field: 'syntheseFinanciere' | keyof RatiosData['commentaires'], value: string) => {
        if (isReadOnly) return;
        if (field === 'syntheseFinanciere') {
            setFormData(prev => ({ ...prev, ratios: { ...prev.ratios, syntheseFinanciere: value }}));
        } else {
             setFormData(prev => ({ ...prev, ratios: { ...prev.ratios, commentaires: { ...prev.ratios.commentaires, [field]: value }} }));
        }
    };
    
    return (
        <div className="bg-white p-4 rounded-lg text-sm">
             {/* Header */}
            <div className="grid grid-cols-12 gap-0 mb-2">
                <FormCell colSpan={2} className="!border-none bg-yellow-400 font-bold">Affaire: ABC</FormCell>
                <FormCell colSpan={8} className="!border-none text-center">{''}</FormCell>
                <FormCell colSpan={2} className="!border-none bg-yellow-400 font-bold text-right">Dossier {formData.dossier}</FormCell>
                <FormCell colSpan={2} className="!border-none bg-gray-200">Date ouverture du dossier</FormCell>
                <FormCell colSpan={10} className="!border-none bg-gray-200">{new Date(formData.dateOuvertureDossier).toLocaleDateString('fr-FR')}</FormCell>
            </div>
            
            <div className="grid grid-cols-12 gap-0 mb-2 border-t-2 border-b-2 border-black">
                <FormCell colSpan={12} className="!border-none bg-gray-600 text-white text-center text-base font-bold">RATIOS</FormCell>
            </div>
            
             <div className="grid grid-cols-12 gap-0 mb-4 border-black">
                <FormCell colSpan={6} isLabel className="font-bold text-red-600">Contrôles sur états financiers :</FormCell>
                <FormCell colSpan={3}>{''}</FormCell>
                <FormCell colSpan={3}>{''}</FormCell>

                <FormCell colSpan={6} isLabel>Dates des exercices saisis</FormCell>
                <FormCell colSpan={3} className="bg-red-100 flex items-center justify-between px-2">
                    <InputField type="text" value={ratios.dates.annee1} onChange={(e) => handleDateChange('annee1', e.target.value)} placeholder="ex: 31/12/2014" className="text-left" readOnly={isReadOnly} />
                    <InputField value={ratios.controles.datesExercicesSaisis.annee1} onChange={(e) => handleControlChange('datesExercicesSaisis', 'annee1', e.target.value)} className="w-12 text-center" readOnly={isReadOnly} />
                </FormCell>
                <FormCell colSpan={3} className="bg-red-100 flex items-center justify-between px-2">
                    <InputField type="text" value={ratios.dates.annee2} onChange={(e) => handleDateChange('annee2', e.target.value)} placeholder="ex: 31/12/2013" className="text-left" readOnly={isReadOnly} />
                    <InputField value={ratios.controles.datesExercicesSaisis.annee2} onChange={(e) => handleControlChange('datesExercicesSaisis', 'annee2', e.target.value)} className="w-12 text-center" readOnly={isReadOnly} />
                </FormCell>
                
                <FormCell colSpan={6} isLabel>Equilibre bilan</FormCell>
                 <FormCell colSpan={3}><InputField value={ratios.controles.equilibreBilan.annee1} onChange={(e) => handleControlChange('equilibreBilan', 'annee1', e.target.value)} readOnly={isReadOnly} /></FormCell>
                 <FormCell colSpan={3}><InputField value={ratios.controles.equilibreBilan.annee2} onChange={(e) => handleControlChange('equilibreBilan', 'annee2', e.target.value)} readOnly={isReadOnly} /></FormCell>

                <FormCell colSpan={6} isLabel>Nombre de mois</FormCell>
                <FormCell colSpan={3}><InputField type="number" value={String(ratios.controles.nombreDeMois.annee1)} onChange={(e) => handleControlChange('nombreDeMois', 'annee1', e.target.value)} readOnly={isReadOnly} /></FormCell>
                <FormCell colSpan={3}><InputField type="number" value={String(ratios.controles.nombreDeMois.annee2)} onChange={(e) => handleControlChange('nombreDeMois', 'annee2', e.target.value)} readOnly={isReadOnly} /></FormCell>

                <FormCell colSpan={6} isHeader>Référence</FormCell>
                <FormCell colSpan={3} isHeader>{ratios.dates.annee1}</FormCell>
                <FormCell colSpan={3} isHeader>{ratios.dates.annee2}</FormCell>

                {/* Structure / Solvabilite */}
                <FormCell colSpan={12} className="bg-black text-white font-bold text-center">STRUCTURE / SOLVABILITE</FormCell>
                <FormCell colSpan={6} isLabel>FP / Total Bilan (ratio de solvabilité)</FormCell>
                <FormCell colSpan={3}><InputField value={ratios.structureSolvabilite.fpTotalBilan.annee1} onChange={e => handleValueChange('structureSolvabilite', 'fpTotalBilan', 'annee1', e.target.value)} readOnly={isReadOnly} /></FormCell>
                <FormCell colSpan={3}><InputField value={ratios.structureSolvabilite.fpTotalBilan.annee2} onChange={e => handleValueChange('structureSolvabilite', 'fpTotalBilan', 'annee2', e.target.value)} readOnly={isReadOnly} /></FormCell>
                <FormCell colSpan={6} isLabel>FP / Dettes financières</FormCell>
                <FormCell colSpan={3}><InputField value={ratios.structureSolvabilite.fpDettesFinancieres.annee1} onChange={e => handleValueChange('structureSolvabilite', 'fpDettesFinancieres', 'annee1', e.target.value)} readOnly={isReadOnly} /></FormCell>
                <FormCell colSpan={3}><InputField value={ratios.structureSolvabilite.fpDettesFinancieres.annee2} onChange={e => handleValueChange('structureSolvabilite', 'fpDettesFinancieres', 'annee2', e.target.value)} readOnly={isReadOnly} /></FormCell>
                <FormCell colSpan={6} isLabel>Emprunts / Capitaux permanents</FormCell>
                <FormCell colSpan={3}><InputField value={ratios.structureSolvabilite.empruntsCapitauxPermanents.annee1} onChange={e => handleValueChange('structureSolvabilite', 'empruntsCapitauxPermanents', 'annee1', e.target.value)} readOnly={isReadOnly} /></FormCell>
                <FormCell colSpan={3}><InputField value={ratios.structureSolvabilite.empruntsCapitauxPermanents.annee2} onChange={e => handleValueChange('structureSolvabilite', 'empruntsCapitauxPermanents', 'annee2', e.target.value)} readOnly={isReadOnly} /></FormCell>
                <FormCell colSpan={6} isLabel>Actif net comptable (en KFCFA)</FormCell>
                <FormCell colSpan={3}><InputField type="number" value={String(ratios.structureSolvabilite.actifNetComptable.annee1)} onChange={e => handleValueChange('structureSolvabilite', 'actifNetComptable', 'annee1', e.target.value)} readOnly={isReadOnly} /></FormCell>
                <FormCell colSpan={3}><InputField type="number" value={String(ratios.structureSolvabilite.actifNetComptable.annee2)} onChange={e => handleValueChange('structureSolvabilite', 'actifNetComptable', 'annee2', e.target.value)} readOnly={isReadOnly} /></FormCell>
                <FormCell colSpan={6} isLabel>FONDS DE ROULEMENT NET GLOBAL (en KFCFA)</FormCell>
                <FormCell colSpan={3}><InputField type="number" value={String(ratios.structureSolvabilite.fondsRoulementNetGlobal.annee1)} onChange={e => handleValueChange('structureSolvabilite', 'fondsRoulementNetGlobal', 'annee1', e.target.value)} readOnly={isReadOnly} /></FormCell>
                <FormCell colSpan={3}><InputField type="number" value={String(ratios.structureSolvabilite.fondsRoulementNetGlobal.annee2)} onChange={e => handleValueChange('structureSolvabilite', 'fondsRoulementNetGlobal', 'annee2', e.target.value)} readOnly={isReadOnly} /></FormCell>
                <FormCell colSpan={6} isLabel>BESOIN EN FONDS DE ROULEMENT (en KFCFA)</FormCell>
                <FormCell colSpan={3}><InputField type="number" value={String(ratios.structureSolvabilite.besoinFondsRoulement.annee1)} onChange={e => handleValueChange('structureSolvabilite', 'besoinFondsRoulement', 'annee1', e.target.value)} readOnly={isReadOnly} /></FormCell>
                <FormCell colSpan={3}><InputField type="number" value={String(ratios.structureSolvabilite.besoinFondsRoulement.annee2)} onChange={e => handleValueChange('structureSolvabilite', 'besoinFondsRoulement', 'annee2', e.target.value)} readOnly={isReadOnly} /></FormCell>
                <FormCell colSpan={6} isLabel>TRESORERIE (en KFCFA)</FormCell>
                <FormCell colSpan={3}><InputField type="number" value={String(ratios.structureSolvabilite.tresorerie.annee1)} onChange={e => handleValueChange('structureSolvabilite', 'tresorerie', 'annee1', e.target.value)} readOnly={isReadOnly} /></FormCell>
                <FormCell colSpan={3}><InputField type="number" value={String(ratios.structureSolvabilite.tresorerie.annee2)} onChange={e => handleValueChange('structureSolvabilite', 'tresorerie', 'annee2', e.target.value)} readOnly={isReadOnly} /></FormCell>
                
                 {/* Delais */}
                <FormCell colSpan={12} className="bg-black text-white font-bold text-center">DELAIS</FormCell>
                <FormCell colSpan={12} isLabel className="bg-blue-200 text-blue-800 font-semibold text-center">en jours de CAHT</FormCell>
                <FormCell colSpan={6} isLabel>Clients / CATTC (en jours)- Pour mémoire : TVA =18%</FormCell>
                <FormCell colSpan={3}><InputField value={ratios.delais.clients.annee1} onChange={e => handleValueChange('delais', 'clients', 'annee1', e.target.value)} readOnly={isReadOnly} /></FormCell>
                <FormCell colSpan={3}><InputField value={ratios.delais.clients.annee2} onChange={e => handleValueChange('delais', 'clients', 'annee2', e.target.value)} readOnly={isReadOnly} /></FormCell>
                <FormCell colSpan={6} isLabel>Stocks mses et produits finis / CAHT (en jours)</FormCell>
                <FormCell colSpan={3}><InputField value={ratios.delais.stocks.annee1} onChange={e => handleValueChange('delais', 'stocks', 'annee1', e.target.value)} readOnly={isReadOnly} /></FormCell>
                <FormCell colSpan={3}><InputField value={ratios.delais.stocks.annee2} onChange={e => handleValueChange('delais', 'stocks', 'annee2', e.target.value)} readOnly={isReadOnly} /></FormCell>
                <FormCell colSpan={6} isLabel>Fournisseurs / Achats & autres charges externes TTC (en jours)</FormCell>
                <FormCell colSpan={3}><InputField value={ratios.delais.fournisseurs.annee1} onChange={e => handleValueChange('delais', 'fournisseurs', 'annee1', e.target.value)} readOnly={isReadOnly} /></FormCell>
                <FormCell colSpan={3}><InputField value={ratios.delais.fournisseurs.annee2} onChange={e => handleValueChange('delais', 'fournisseurs', 'annee2', e.target.value)} readOnly={isReadOnly} /></FormCell>

                 {/* Rentabilite */}
                <FormCell colSpan={12} className="bg-black text-white font-bold text-center">RENTABILITE / PERFORMANCE</FormCell>
                <FormCell colSpan={6} isLabel>% Charges de personnel / chiffre d'affaires</FormCell>
                <FormCell colSpan={3}><InputField value={ratios.rentabilitePerformance.chargesPersonnel.annee1} onChange={e => handleValueChange('rentabilitePerformance', 'chargesPersonnel', 'annee1', e.target.value)} readOnly={isReadOnly} /></FormCell>
                <FormCell colSpan={3}><InputField value={ratios.rentabilitePerformance.chargesPersonnel.annee2} onChange={e => handleValueChange('rentabilitePerformance', 'chargesPersonnel', 'annee2', e.target.value)} readOnly={isReadOnly} /></FormCell>
                <FormCell colSpan={6} isLabel>Rentabilité d'exploitation (EBE / CA)</FormCell>
                <FormCell colSpan={3}><InputField value={ratios.rentabilitePerformance.rentabiliteExploitation.annee1} onChange={e => handleValueChange('rentabilitePerformance', 'rentabiliteExploitation', 'annee1', e.target.value)} readOnly={isReadOnly} /></FormCell>
                <FormCell colSpan={3}><InputField value={ratios.rentabilitePerformance.rentabiliteExploitation.annee2} onChange={e => handleValueChange('rentabilitePerformance', 'rentabiliteExploitation', 'annee2', e.target.value)} readOnly={isReadOnly} /></FormCell>
                <FormCell colSpan={6} isLabel>Charges financières / EBE</FormCell>
                <FormCell colSpan={3}><InputField value={ratios.rentabilitePerformance.chargesFinancieres.annee1} onChange={e => handleValueChange('rentabilitePerformance', 'chargesFinancieres', 'annee1', e.target.value)} readOnly={isReadOnly} /></FormCell>
                <FormCell colSpan={3}><InputField value={ratios.rentabilitePerformance.chargesFinancieres.annee2} onChange={e => handleValueChange('rentabilitePerformance', 'chargesFinancieres', 'annee2', e.target.value)} readOnly={isReadOnly} /></FormCell>
                 <FormCell colSpan={6} isLabel>Résultat net / Chiffre d'affaires</FormCell>
                <FormCell colSpan={3}><InputField value={ratios.rentabilitePerformance.resultatNet.annee1} onChange={e => handleValueChange('rentabilitePerformance', 'resultatNet', 'annee1', e.target.value)} readOnly={isReadOnly} /></FormCell>
                <FormCell colSpan={3}><InputField value={ratios.rentabilitePerformance.resultatNet.annee2} onChange={e => handleValueChange('rentabilitePerformance', 'resultatNet', 'annee2', e.target.value)} readOnly={isReadOnly} /></FormCell>

                {/* Synthese */}
                <FormCell colSpan={12} isHeader className="bg-yellow-200 !text-black !font-bold" isLabel>SYNTHESE FINANCIERE (Report page 2)</FormCell>
                <FormCell colSpan={12} className="h-24 !p-0"><TextAreaField name="syntheseFinanciere" value={ratios.syntheseFinanciere} onChange={e => handleTextChange('syntheseFinanciere', e.target.value)} className="bg-yellow-50" readOnly={isReadOnly} /></FormCell>

                 {/* Commentaires */}
                <FormCell colSpan={12} isHeader className="bg-gray-300 !text-black !font-bold" isLabel>COMMENTAIRES BILAN / CDR / RATIOS</FormCell>
                <FormCell colSpan={12} isHeader isLabel>STRUCTURE / TRESORERIE</FormCell>
                <FormCell colSpan={12} className="h-24 !p-0"><TextAreaField name="structureTresorerie" value={ratios.commentaires.structureTresorerie} onChange={e => handleTextChange('structureTresorerie', e.target.value)} readOnly={isReadOnly} /></FormCell>
                <FormCell colSpan={12} isHeader isLabel>PERFORMANCE / RENTABILITE</FormCell>
                 <FormCell colSpan={12} className="h-24 !p-0"><TextAreaField name="performanceRentabilite" value={ratios.commentaires.performanceRentabilite} onChange={e => handleTextChange('performanceRentabilite', e.target.value)} readOnly={isReadOnly} /></FormCell>
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

export default RatiosPage;