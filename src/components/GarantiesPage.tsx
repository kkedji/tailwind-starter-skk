



import React, { useMemo } from 'react';
import { CreditApplicationData, GarantieRow, ConditionSpecialeRow, GarantiesData } from '../types.ts';
import { garantieDetenueOptions } from '../constants.ts';

interface GarantiesPageProps {
  formData: CreditApplicationData;
  setFormData: React.Dispatch<React.SetStateAction<CreditApplicationData>>;
  onNext: () => void;
  isReadOnly?: boolean;
}

const FormCell = ({ children, className = '', colSpan = 1, rowSpan = 1, isHeader = false, isSubHeader = false, isTitle = false, isLabel = false, align = 'center', style: customStyle }: { children: any, className?: string, colSpan?: number, rowSpan?: number, isHeader?: boolean, isSubHeader?: boolean, isTitle?: boolean, isLabel?: boolean, align?: string, style?: React.CSSProperties }) => {
    const baseClasses = 'border border-gray-400 p-1 text-xs flex items-center';
    const bgClasses = isTitle ? 'bg-gray-300 font-bold' : isHeader ? 'bg-gray-200 font-semibold' : isSubHeader ? 'bg-gray-100 font-semibold' : 'bg-white';
    const alignClasses = `justify-${align}`;
    const style = {
        gridColumn: `span ${colSpan} / span ${colSpan}`,
        gridRow: `span ${rowSpan} / span ${rowSpan}`,
        ...customStyle,
    };
    return <div style={style} className={`${baseClasses} ${bgClasses} ${className} ${alignClasses}`}>{children}</div>;
};

const InputField = ({ value, onChange, name = '', type = 'text', className = '', readOnly = false, ...rest }) => (
    <input type={type} name={name} value={value ?? ''} onChange={onChange} readOnly={readOnly} className={`w-full h-full bg-transparent outline-none text-xs px-1 ${readOnly ? 'bg-gray-100 cursor-not-allowed' : ''} ${className}`} {...rest} />
);

const SelectField = ({ value, onChange, name, options, className = '', readOnly = false }) => (
    <select name={name} value={value} onChange={onChange} disabled={readOnly} className={`w-full h-full bg-transparent outline-none text-xs ${readOnly ? 'bg-gray-100 cursor-not-allowed' : ''} ${className}`}>
        <option value=""></option>
        {options.map((opt, i) => <option key={i} value={typeof opt === 'object' ? opt.value : opt}>{typeof opt === 'object' ? opt.label : opt}</option>)}
    </select>
);

const TextAreaField = ({ value, onChange, name, className = '', rows = 2, readOnly = false }) => (
    <textarea name={name} value={value ?? ''} onChange={onChange} rows={rows} readOnly={readOnly} className={`w-full h-full bg-transparent outline-none text-xs p-1 ${readOnly ? 'bg-gray-100 cursor-not-allowed' : ''} ${className}`} />
);

const ActionButton = ({ onClick, children, className = '' }) => (
    <button type="button" onClick={onClick} className={`text-xs px-2 py-1 rounded ${className}`}>
        {children}
    </button>
);


const GarantiesPage: React.FC<GarantiesPageProps> = ({ formData, setFormData, onNext, isReadOnly = false }) => {

    const { garanties: garantiesData, nouveauxCredits, creditsEnCours } = formData;
    
    const handleGarantieChange = (index: number, field: keyof GarantieRow, value: any) => {
        if (isReadOnly) return;
        setFormData(prev => {
            const newGaranties = [...prev.garanties.garanties];
            const currentItem = newGaranties[index];
            const fieldType = typeof currentItem[field];
            const finalValue = fieldType === 'number' ? parseFloat(value) || 0 : value;
            
            newGaranties[index] = { ...currentItem, [field]: finalValue };
            
            return {
                ...prev,
                garanties: {
                    ...prev.garanties,
                    garanties: newGaranties,
                }
            };
        });
    };
    
    const addGarantieRow = () => {
         if (isReadOnly) return;
         const newRow: GarantieRow = { 
            id: Date.now().toString(),
            lignesCredit: '',
            garantiesDetenues: '',
            rangOuPct: '',
            reference: '',
            consistance: '',
            valeurOrigine: 0,
            valeurActuelleEstimee: 0,
            encoursCredit: 0,
            valorisationBanque: 0,
        };
        setFormData(prev => ({
            ...prev,
            garanties: {
                ...prev.garanties,
                garanties: [...prev.garanties.garanties, newRow]
            }
        }));
    };

    const removeGarantieRow = (index: number) => {
        if (isReadOnly) return;
        setFormData(prev => ({
            ...prev,
            garanties: {
                ...prev.garanties,
                garanties: prev.garanties.garanties.filter((_, i) => i !== index)
            }
        }));
    };
    
     const handleConditionChange = (index: number, value: string) => {
        if (isReadOnly) return;
        setFormData(prev => {
            const newConditions = [...prev.garanties.conditionsSpeciales];
            newConditions[index] = { ...newConditions[index], condition: value };
            return {
                ...prev,
                garanties: {
                    ...prev.garanties,
                    conditionsSpeciales: newConditions
                }
            };
        });
    };

    const addConditionRow = () => {
        if (isReadOnly) return;
        const newRow: ConditionSpecialeRow = { id: Date.now().toString(), condition: '' };
        setFormData(prev => ({
            ...prev,
            garanties: {
                ...prev.garanties,
                conditionsSpeciales: [...prev.garanties.conditionsSpeciales, newRow]
            }
        }));
    };

    const removeConditionRow = (index: number) => {
        if (isReadOnly) return;
        setFormData(prev => ({
            ...prev,
            garanties: {
                ...prev.garanties,
                conditionsSpeciales: prev.garanties.conditionsSpeciales.filter((_, i) => i !== index)
            }
        }));
    };
    
    const handleFieldChange = (field: keyof Omit<GarantiesData, 'garanties' | 'conditionsSpeciales'>, value: any) => {
        if (isReadOnly) return;
        setFormData(prev => ({
            ...prev,
            garanties: {
                ...prev.garanties,
                [field]: value
            }
        }));
    }

    const calculations = useMemo(() => {
        const totalEngagements = nouveauxCredits.reduce((sum, credit) => sum + Number(credit.montantPropose), 0) + creditsEnCours.reduce((sum, credit) => sum + Number(credit.montantEncours), 0);
        
        const totals = garantiesData.garanties.reduce((acc, g) => {
            const valeurNette = Number(g.valeurActuelleEstimee) - Number(g.encoursCredit);
            const valeurCalculee = valeurNette * (Number(g.valorisationBanque) / 100);
            const valeurGarantieRetenue = valeurCalculee; // Per user request

            acc.valeurOrigine += Number(g.valeurOrigine);
            acc.valeurActuelleEstimee += Number(g.valeurActuelleEstimee);
            acc.encoursCredit += Number(g.encoursCredit);
            acc.valeurNette += valeurNette;
            acc.valeurCalculeeMaxi += valeurCalculee;
            acc.valeurGarantieRetenue += valeurGarantieRetenue; // Summing the calculated value
            return acc;
        }, {
            valeurOrigine: 0,
            valeurActuelleEstimee: 0,
            encoursCredit: 0,
            valeurNette: 0,
            valeurCalculeeMaxi: 0,
            valeurGarantieRetenue: 0
        });

        const tauxCouverture = totalEngagements > 0 ? (totals.valeurGarantieRetenue / totalEngagements) : 0;
        
        return { totalEngagements, ...totals, tauxCouverture };
    }, [garantiesData.garanties, nouveauxCredits, creditsEnCours]);
    
    const displayTauxCouverture = garantiesData.tauxDeCouverture !== undefined
        ? garantiesData.tauxDeCouverture
        : parseFloat((calculations.tauxCouverture * 100).toFixed(0));


    return (
        <div className="bg-white p-4 rounded-lg text-sm">
            {/* Header */}
            <div className="grid grid-cols-24 gap-0 mb-2">
                <FormCell colSpan={3} isHeader align="left">Affaire</FormCell>
                <FormCell colSpan={5} isSubHeader align="left">{formData.affaire}</FormCell>
                <FormCell colSpan={8} isHeader className="text-center font-bold text-base" style={{backgroundColor: '#8A9A5B'}}>Garanties</FormCell>
                <FormCell colSpan={8} isHeader className="text-right font-bold">Dossier {formData.dossier}</FormCell>
                <FormCell colSpan={3} isHeader align="left">Date ouverture du dossier</FormCell>
                <FormCell colSpan={5} isSubHeader align="left">{new Date(formData.dateOuvertureDossier).toLocaleDateString('fr-FR')}</FormCell>
                <FormCell colSpan={16} isSubHeader>{''}</FormCell>
            </div>

            {/* Main Grid for Header and Table */}
            <div className="grid grid-cols-27 gap-0 mb-2 border-t-2 border-gray-500 text-center">

                {/* Taux de Couverture Row */}
                <FormCell colSpan={8} align="left" className="font-bold">TAUX DE COUVERTURE = Valeur garantie retenue / Total engagements</FormCell>
                <FormCell colSpan={2} className="bg-yellow-200 font-bold !p-0 flex items-center">
                    <InputField 
                        type="number" 
                        value={String(displayTauxCouverture)} 
                        onChange={(e) => handleFieldChange('tauxDeCouverture', parseFloat(e.target.value) || 0)}
                        className="w-full"
                        readOnly={isReadOnly}
                    />
                    <span className="px-1">%</span>
                </FormCell>
                <FormCell colSpan={8} align="center" className="text-red-500 font-bold">Taux de couverture minimum / maximum à définir par la banque</FormCell>
                <FormCell colSpan={9} align="left" className="!p-0"><InputField type="number" value={String(garantiesData.tauxCouvertureMinimum)} onChange={(e) => handleFieldChange('tauxCouvertureMinimum', parseFloat(e.target.value) || 0)} readOnly={isReadOnly}/> %</FormCell>
                
                {/* TOTAL Row - Aligned with the table columns */}
                <FormCell colSpan={2+3+1+2+4} isHeader className="font-bold">TOTAL</FormCell>
                <FormCell colSpan={2} isHeader className="!justify-end pr-1">{calculations.valeurOrigine.toLocaleString()}</FormCell>
                <FormCell colSpan={2} isHeader className="!justify-end pr-1">{calculations.valeurActuelleEstimee.toLocaleString()}</FormCell>
                <FormCell colSpan={2} isHeader className="!justify-end pr-1">{calculations.encoursCredit.toLocaleString()}</FormCell>
                <FormCell colSpan={2} isHeader className="!justify-end pr-1">{calculations.valeurNette.toLocaleString()}</FormCell>
                <FormCell colSpan={2} isHeader>{''}</FormCell> {/* Spacer for % Valorisation */}
                <FormCell colSpan={2} isHeader className="!justify-end pr-1">{calculations.valeurCalculeeMaxi.toLocaleString()}</FormCell>
                <FormCell colSpan={2} isHeader className="!justify-end pr-1">{calculations.valeurGarantieRetenue.toLocaleString()}</FormCell>
                <FormCell colSpan={1} isHeader>{''}</FormCell> {/* Spacer for Action */}
                
                {/* Table Headers */}
                <FormCell colSpan={2} isHeader>Lignes crédit (En cours et Nouveaux)</FormCell>
                <FormCell colSpan={3} isHeader>Garanties détenues au titre des crédits (1 ligne par garantie)</FormCell>
                <FormCell colSpan={1} isHeader>Rang ou %</FormCell>
                <FormCell colSpan={2} isHeader>Référence</FormCell>
                <FormCell colSpan={4} isHeader>Consistance (superficie, situation, affectation...) et charges (organisme, nature, montant, date)</FormCell>
                <FormCell colSpan={2} isHeader className="bg-yellow-100">Valeur d'origine (FCFA)</FormCell>
                <FormCell colSpan={2} isHeader className="bg-yellow-100">Valeur actuelle estimée (FCFA)</FormCell>
                <FormCell colSpan={2} isHeader className="bg-yellow-100">Encours crédit (FCFA)</FormCell>
                <FormCell colSpan={2} isHeader className="bg-yellow-100">Valeur nette (FCFA) (a)</FormCell>
                <FormCell colSpan={2} isHeader className="bg-yellow-100">% Valorisation retenue par la banque (b)</FormCell>
                <FormCell colSpan={2} isHeader className="bg-yellow-100">Valeur calculée maxi (FCFA) (a) X (b)</FormCell>
                <FormCell colSpan={2} isHeader className="bg-yellow-100">Valeur garantie retenue (FCFA) (c)</FormCell>
                <FormCell colSpan={1} isHeader>Act.</FormCell>
                
                {/* Table Body */}
                {garantiesData.garanties.map((g, index) => {
                     const valeurNette = Number(g.valeurActuelleEstimee) - Number(g.encoursCredit);
                     const valeurCalculeeMaxi = valeurNette * (Number(g.valorisationBanque) / 100);
                     const valeurGarantieRetenue = valeurCalculeeMaxi;
                     return (
                        <React.Fragment key={g.id}>
                            <FormCell colSpan={2} className="!p-0">
                                <InputField
                                    value={g.lignesCredit}
                                    onChange={(e) => handleGarantieChange(index, 'lignesCredit', e.target.value)}
                                    className="text-left"
                                    readOnly={isReadOnly}
                                />
                            </FormCell>
                            <FormCell colSpan={3} className="!p-0">
                                <SelectField
                                    name="garantiesDetenues"
                                    value={g.garantiesDetenues}
                                    onChange={(e) => handleGarantieChange(index, 'garantiesDetenues', e.target.value)}
                                    options={garantieDetenueOptions}
                                    readOnly={isReadOnly}
                                />
                            </FormCell>
                            <FormCell colSpan={1} className="!p-0"><InputField value={g.rangOuPct} onChange={(e) => handleGarantieChange(index, 'rangOuPct', e.target.value)} readOnly={isReadOnly}/></FormCell>
                            <FormCell colSpan={2} className="!p-0"><InputField value={g.reference} onChange={(e) => handleGarantieChange(index, 'reference', e.target.value)} readOnly={isReadOnly}/></FormCell>
                            <FormCell colSpan={4} className="!p-0"><TextAreaField rows={1} value={g.consistance} name="consistance" onChange={(e) => handleGarantieChange(index, 'consistance', e.target.value)} className="text-left !p-1" readOnly={isReadOnly}/></FormCell>
                            <FormCell colSpan={2} className="!p-0"><InputField type="number" value={String(g.valeurOrigine)} onChange={(e) => handleGarantieChange(index, 'valeurOrigine', e.target.value)} readOnly={isReadOnly}/></FormCell>
                            <FormCell colSpan={2} className="!p-0"><InputField type="number" value={String(g.valeurActuelleEstimee)} onChange={(e) => handleGarantieChange(index, 'valeurActuelleEstimee', e.target.value)} readOnly={isReadOnly}/></FormCell>
                            <FormCell colSpan={2} className="!p-0"><InputField type="number" value={String(g.encoursCredit)} onChange={(e) => handleGarantieChange(index, 'encoursCredit', e.target.value)} readOnly={isReadOnly}/></FormCell>
                            <FormCell colSpan={2} isSubHeader className="!justify-end pr-1">{valeurNette.toLocaleString()}</FormCell>
                            <FormCell colSpan={2} className="!p-0"><InputField type="number" value={String(g.valorisationBanque)} onChange={(e) => handleGarantieChange(index, 'valorisationBanque', e.target.value)} readOnly={isReadOnly}/></FormCell>
                            <FormCell colSpan={2} isSubHeader className="!justify-end pr-1">{valeurCalculeeMaxi.toLocaleString()}</FormCell>
                            <FormCell colSpan={2} isSubHeader className="!justify-end pr-1 bg-yellow-100">{valeurGarantieRetenue.toLocaleString()}</FormCell>
                            <FormCell colSpan={1}>{!isReadOnly && <ActionButton onClick={() => removeGarantieRow(index)} className="text-red-500 hover:bg-red-100 w-full">[-]</ActionButton>}</FormCell>
                        </React.Fragment>
                     )
                })}
                {!isReadOnly && <FormCell colSpan={27}>
                    <ActionButton onClick={addGarantieRow} className="text-green-600 hover:bg-green-100 w-full">[+] Ajouter une garantie</ActionButton>
                </FormCell>}
            </div>
            
             {/* Conditions Spéciales */}
            <div className="grid grid-cols-24 gap-0 mb-4 border-t-2 border-gray-500">
                <FormCell colSpan={24} className="bg-blue-300 text-black font-bold text-center">Conditions spéciales</FormCell>
                 {garantiesData.conditionsSpeciales.map((c, index) => (
                     <React.Fragment key={c.id}>
                        <FormCell colSpan={23} align="left"><InputField value={c.condition} onChange={(e) => handleConditionChange(index, e.target.value)} className="text-left" readOnly={isReadOnly}/></FormCell>
                        <FormCell colSpan={1}>{!isReadOnly && <ActionButton onClick={() => removeConditionRow(index)} className="text-red-500 hover:bg-red-100 w-full">[-]</ActionButton>}</FormCell>
                     </React.Fragment>
                 ))}
                 {!isReadOnly && <FormCell colSpan={24}>
                    <ActionButton onClick={addConditionRow} className="text-green-600 hover:bg-green-100 w-full">[+] Ajouter une condition</ActionButton>
                </FormCell>}
            </div>
            
            {/* Synthèse */}
            <div className="grid grid-cols-24 gap-0 mb-4 border-t-2 border-gray-500">
                <FormCell colSpan={24} isHeader>Synthèse : commentaires de l'agence sur les garanties</FormCell>
                <FormCell colSpan={24} className="!p-0 h-24"><TextAreaField rows={4} name="synthese" value={garantiesData.synthese} onChange={e => handleFieldChange('synthese', e.target.value)} className="bg-yellow-50" readOnly={isReadOnly}/></FormCell>
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

export default GarantiesPage;
