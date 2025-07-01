import React, { useState, useMemo, Fragment } from 'react';
import { CreditApplicationData, TresorerieData, TresorerieRowData, DynamicTresorerieRow } from '../types.ts';

interface TresoreriePageProps {
  formData: CreditApplicationData;
  setFormData: React.Dispatch<React.SetStateAction<CreditApplicationData>>;
  onNext: () => void;
  isReadOnly?: boolean;
}

type TresorerieStaticRowKey = keyof Omit<TresorerieData['rows'], 'ventesAutres' | 'autresRecettes' | 'achatsAutres' | 'autresDepenses' | 'autresSalaires' | 'autresCharges' | 'autresRessources' | 'dividendes'>;
type TresorerieDynamicSectionKey = keyof Pick<TresorerieData['rows'], 'ventesAutres' | 'autresRecettes' | 'achatsAutres' | 'autresDepenses' | 'autresSalaires' | 'autresCharges' | 'autresRessources' | 'dividendes'>;


const FormCell = ({ children, className = '', colSpan = 1, rowSpan = 1, align = 'center' }) => {
    const baseClasses = 'border-dotted border-gray-400 border p-1 text-xs flex items-center';
    const alignClass = `justify-${align}`;
    const style = { gridColumn: `span ${colSpan} / span ${colSpan}`, gridRow: `span ${rowSpan} / span ${rowSpan}` };
    return <div style={style} className={`${baseClasses} ${alignClass} ${className}`}>{children}</div>;
};

const InputField = ({ value, onChange, type = 'text', className = '', readOnly = false }: { value: any, onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void, type?: string, className?: string, readOnly?: boolean }) => (
    <input type={type} value={value ?? ''} onChange={onChange} readOnly={readOnly} className={`w-full h-full bg-transparent outline-none text-xs px-1 text-right ${className} ${readOnly ? 'cursor-default bg-gray-100' : ''}`} />
);

const LabelInputField = ({ value, onChange, className = '', readOnly = false }) => (
    <input type="text" value={value ?? ''} onChange={onChange} readOnly={readOnly} className={`w-full h-full bg-transparent outline-none text-xs px-1 text-left ${className} ${readOnly ? 'cursor-default bg-gray-100' : ''}`} />
);

const TextArea = ({ value, onChange, rows, placeholder = '', readOnly = false }) => (
    <textarea value={value ?? ''} onChange={onChange} rows={rows} placeholder={placeholder} readOnly={readOnly} className={`w-full h-full bg-transparent outline-none text-xs p-1 border border-gray-300 rounded ${readOnly ? 'cursor-default bg-gray-100' : ''}`} />
);

const ActionButton = ({ onClick, children, className = '' }) => (
    <button type="button" onClick={onClick} className={`text-xs px-2 py-1 rounded ${className}`}>
        {children}
    </button>
);


const sumRowDataArrays = (arrays: number[][]): number[] => {
    if (arrays.length === 0) return Array(12).fill(0);
    return Array(12).fill(0).map((_, i) => arrays.reduce((sum, arr) => sum + (arr[i] || 0), 0));
};


const TresoreriePage: React.FC<TresoreriePageProps> = ({ formData, setFormData, onNext, isReadOnly = false }) => {
    const { tresorerie } = formData;
    const [months, setMonths] = useState<string[]>(Array(12).fill(''));
    const [numMonths, setNumMonths] = useState(0);

    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (isReadOnly) return;
        const newDate = e.target.value;
        handleFieldChange('soldeDate', newDate);

        if (newDate) {
            const date = new Date(newDate);
             if (!isNaN(date.getTime())) {
                const monthNames = ["Jan", "Fev", "Mar", "Avr", "Mai", "Juin", "Juil", "Aou", "Sep", "Oct", "Nov", "Dec"];
                const generatedMonths = Array.from({ length: 12 }, (_, i) => {
                    const d = new Date(date.getFullYear(), date.getMonth() - (11 - i), 1);
                    return `${monthNames[d.getMonth()]}-${d.getFullYear().toString().slice(-2)}`;
                });
                setMonths(generatedMonths);
                setNumMonths(12);
            } else {
                setMonths(Array(12).fill(''));
                setNumMonths(0);
            }
        } else {
            setMonths(Array(12).fill(''));
            setNumMonths(0);
        }
    };
    
    const handleFieldChange = (key: keyof TresorerieData, value: any) => {
        if (isReadOnly) return;
        setFormData(prev => ({ ...prev, tresorerie: { ...prev.tresorerie, [key]: value } }));
    };

    const handleStaticRowChange = (rowKey: TresorerieStaticRowKey, field: keyof TresorerieRowData, value: string, monthIndex?: number) => {
        if (isReadOnly) return;
        setFormData(prev => {
            const newRows = { ...prev.tresorerie.rows };
            const rowData = newRows[rowKey];
            if (field === 'values' && monthIndex !== undefined) {
                rowData.values[monthIndex] = parseFloat(value) || 0;
            } else if (field === 'moyenneRaisonnee') {
                rowData.moyenneRaisonnee = parseFloat(value) || 0;
            } else if (field === 'commentaire') {
                rowData.commentaire = value;
            }
            return { ...prev, tresorerie: { ...prev.tresorerie, rows: newRows } };
        });
    };

    const handleDynamicRowChange = (sectionKey: TresorerieDynamicSectionKey, rowIndex: number, field: 'label' | keyof TresorerieRowData, value: string, monthIndex?: number) => {
        if (isReadOnly) return;
        setFormData(prev => {
            const newRows = { ...prev.tresorerie.rows };
            const section = [...newRows[sectionKey]];
            const row = section[rowIndex];
            if (field === 'label') {
                row.label = value;
            } else if (field === 'values' && monthIndex !== undefined) {
                row.data.values[monthIndex] = parseFloat(value) || 0;
            } else if (field === 'moyenneRaisonnee') {
                row.data.moyenneRaisonnee = parseFloat(value) || 0;
            } else if (field === 'commentaire') {
                row.data.commentaire = value;
            }
            newRows[sectionKey] = section;
            return { ...prev, tresorerie: { ...prev.tresorerie, rows: newRows } };
        });
    };

    const addDynamicRow = (sectionKey: TresorerieDynamicSectionKey, label: string) => {
        if (isReadOnly) return;
        setFormData(prev => {
            const newRows = { ...prev.tresorerie.rows };
            const section = [...newRows[sectionKey]];
            const newRow: DynamicTresorerieRow = {
                id: Date.now().toString() + Math.random().toString(),
                label: label,
                data: { values: Array(12).fill(0), moyenneRaisonnee: 0, commentaire: '' }
            };
            section.push(newRow);
            newRows[sectionKey] = section;
            return { ...prev, tresorerie: { ...prev.tresorerie, rows: newRows } };
        });
    };

    const removeDynamicRow = (sectionKey: TresorerieDynamicSectionKey, rowIndex: number) => {
        if (isReadOnly) return;
        setFormData(prev => {
            const newRows = { ...prev.tresorerie.rows };
            const section = newRows[sectionKey].filter((_, i) => i !== rowIndex);
            newRows[sectionKey] = section;
            return { ...prev, tresorerie: { ...prev.tresorerie, rows: newRows } };
        });
    };


    const calculations = useMemo(() => {
        const { rows } = tresorerie;
        const calc = (data: (TresorerieRowData | DynamicTresorerieRow[])[]) => {
            const valuesArrays: number[][] = [];
            let mrSum = 0;
            
            data.forEach(d => {
                if (Array.isArray(d)) {
                    d.forEach(dynamicRow => {
                        valuesArrays.push(dynamicRow.data.values);
                        mrSum += dynamicRow.data.moyenneRaisonnee;
                    });
                } else {
                    valuesArrays.push(d.values);
                    mrSum += d.moyenneRaisonnee;
                }
            });
            const totalValues = sumRowDataArrays(valuesArrays);
            return { values: totalValues, moyenneRaisonnee: mrSum, commentaire: '' };
        };

        const recettesVentes = calc([rows.ventesJustifiees, rows.ventesAutreCompte, rows.ventesCompteConfrere, rows.ventesAutres]);
        const autresRecettes = calc([rows.autresRecettes]);
        const recettesExploitation = calc([recettesVentes, autresRecettes]);
        
        const achatsTTC = calc([rows.achatsJustifies, rows.achatsAutreCompte, rows.achatsCompteConfrere, rows.achatsAutres]);
        const autresDepenses = calc([rows.autresDepenses]);
        const fraisPersonnel = calc([rows.salaireDirigeant, rows.salaires, rows.autresSalaires, rows.cnss, rows.impotsRevenu]);
        const chargesExternes = calc([rows.loyer, rows.electricite, rows.transport, rows.deplacements, rows.servicesExterieurs, rows.telephone, rows.autresCharges]);
        const impotsTaxes = calc([rows.impotsTaxes]);
        const fraisDouanes = calc([rows.fraisDouanes]);
        const fraisFinanciers = calc([rows.fraisFinanciers]);
        const tvaAPayer = calc([rows.tvaAPayer]);


        const depensesExploitation = calc([achatsTTC, autresDepenses, fraisPersonnel, chargesExternes, impotsTaxes, fraisDouanes, fraisFinanciers, tvaAPayer]);
        
        const cashFlowExploitation = { 
            values: recettesExploitation.values.map((r, i) => r - depensesExploitation.values[i]),
            moyenneRaisonnee: recettesExploitation.moyenneRaisonnee - depensesExploitation.moyenneRaisonnee
        };
        
        const ressourcesHorsExploitation = calc([rows.emprunts, rows.augmentationCapital, rows.apportCC, rows.autresRessources]);
        const sortiesHorsExploitation = calc([rows.rembEmprunts, rows.dividendes]);
        const cashFlowHorsExploitation = {
            values: ressourcesHorsExploitation.values.map((r, i) => r - sortiesHorsExploitation.values[i]),
            moyenneRaisonnee: ressourcesHorsExploitation.moyenneRaisonnee - sortiesHorsExploitation.moyenneRaisonnee
        };

        const cashFlowActivite = {
            values: cashFlowExploitation.values.map((c, i) => c + cashFlowHorsExploitation.values[i]),
            moyenneRaisonnee: cashFlowExploitation.moyenneRaisonnee + cashFlowHorsExploitation.moyenneRaisonnee
        };

        const revenusMenage = calc([rows.revenusMenage]);
        const depensesMenage = calc([rows.depensesMenage]);
        const cashFlowMenage = {
            values: revenusMenage.values.map((r, i) => r - depensesMenage.values[i]),
            moyenneRaisonnee: revenusMenage.moyenneRaisonnee - depensesMenage.moyenneRaisonnee
        };
        
        const cashFlowTotal = {
            values: cashFlowActivite.values.map((c, i) => c + cashFlowMenage.values[i]),
            moyenneRaisonnee: cashFlowActivite.moyenneRaisonnee + cashFlowMenage.moyenneRaisonnee
        };

        const soldeCumule = cashFlowTotal.values.reduce((acc, cf, i) => {
            const prevSolde = i > 0 ? acc[i - 1] : (tresorerie.soldeInitial || 0);
            acc.push(prevSolde + (cf || 0));
            return acc;
        }, [] as number[]);
        
        return { recettesVentes, autresRecettes, recettesExploitation, achatsTTC, autresDepenses, fraisPersonnel, chargesExternes, impotsTaxes, fraisDouanes, fraisFinanciers, tvaAPayer, depensesExploitation, cashFlowExploitation, ressourcesHorsExploitation, sortiesHorsExploitation, cashFlowHorsExploitation, cashFlowActivite, revenusMenage, depensesMenage, cashFlowMenage, cashFlowTotal, soldeCumule };
    }, [tresorerie, numMonths]);

    const renderStaticRow = (label, rowKey: TresorerieStaticRowKey, bgColorClass = 'bg-white') => {
        const rowData = tresorerie.rows[rowKey];
        const total = rowData.values.reduce((s, v) => s + v, 0);
        const moyenne = numMonths > 0 ? total / numMonths : 0;
        return (
            <>
                <FormCell colSpan={6} align="start" className={`${bgColorClass}`}>{label}</FormCell>
                <FormCell className={bgColorClass}>{''}</FormCell>
                {rowData.values.map((val, i) => (
                    <FormCell key={i} className={bgColorClass}><InputField type="number" value={String(val)} onChange={e => handleStaticRowChange(rowKey, 'values', e.target.value, i)} readOnly={isReadOnly} /></FormCell>
                ))}
                <FormCell className={bgColorClass}><InputField value={total.toLocaleString()} readOnly /></FormCell>
                <FormCell className={bgColorClass}><InputField value={moyenne.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})} readOnly /></FormCell>
                <FormCell className={bgColorClass}><InputField type="number" value={String(rowData.moyenneRaisonnee)} onChange={e => handleStaticRowChange(rowKey, 'moyenneRaisonnee', e.target.value)} readOnly={isReadOnly} /></FormCell>
                <FormCell colSpan={2} className={bgColorClass}><LabelInputField value={rowData.commentaire} onChange={e => handleStaticRowChange(rowKey, 'commentaire', e.target.value)} readOnly={isReadOnly} /></FormCell>
                <FormCell className={bgColorClass}>{''}</FormCell>
            </>
        );
    };

    const renderDynamicSection = (sectionKey: TresorerieDynamicSectionKey, newRowLabel: string, bgColorClass = 'bg-white') => {
        const sectionData = tresorerie.rows[sectionKey];
        return (
            <>
                {sectionData.map((row, index) => {
                    const total = row.data.values.reduce((s, v) => s + v, 0);
                    const moyenne = numMonths > 0 ? total / numMonths : 0;
                    return (
                        <Fragment key={row.id}>
                            <FormCell colSpan={6} align="start" className={bgColorClass}>
                               <LabelInputField value={row.label} onChange={e => handleDynamicRowChange(sectionKey, index, 'label', e.target.value)} readOnly={isReadOnly} />
                            </FormCell>
                            <FormCell className={bgColorClass}>{''}</FormCell>
                            {row.data.values.map((val, i) => (
                                <FormCell key={i} className={bgColorClass}><InputField type="number" value={String(val)} onChange={e => handleDynamicRowChange(sectionKey, index, 'values', e.target.value, i)} readOnly={isReadOnly} /></FormCell>
                            ))}
                            <FormCell className={bgColorClass}><InputField value={total.toLocaleString()} readOnly /></FormCell>
                            <FormCell className={bgColorClass}><InputField value={moyenne.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} readOnly /></FormCell>
                            <FormCell className={bgColorClass}><InputField type="number" value={String(row.data.moyenneRaisonnee)} onChange={e => handleDynamicRowChange(sectionKey, index, 'moyenneRaisonnee', e.target.value)} readOnly={isReadOnly} /></FormCell>
                            <FormCell colSpan={2} className={bgColorClass}><LabelInputField value={row.data.commentaire} onChange={e => handleDynamicRowChange(sectionKey, index, 'commentaire', e.target.value)} readOnly={isReadOnly} /></FormCell>
                            <FormCell className={bgColorClass}>
                                {!isReadOnly && <ActionButton onClick={() => removeDynamicRow(sectionKey, index)} className="text-red-500 hover:bg-red-100 w-full">[-]</ActionButton>}
                            </FormCell>
                        </Fragment>
                    )
                })}
                {!isReadOnly && <FormCell colSpan={25}>
                    <ActionButton onClick={() => addDynamicRow(sectionKey, newRowLabel)} className="text-green-600 hover:bg-green-100 w-full">[+] Ajouter {newRowLabel}</ActionButton>
                </FormCell>}
            </>
        )
    };
    
    const renderCalculatedRow = (label: string, result: {values: number[], moyenneRaisonnee: number}, bgColorClass = '', isBold=false) => {
        const total = result.values.reduce((s, v) => s + v, 0);
        const moyenne = numMonths > 0 ? total / numMonths : 0;
         return (
            <>
                <FormCell colSpan={6} align="start" className={`${isBold ? 'font-bold': ''} ${bgColorClass}`}>{label}</FormCell>
                <FormCell className={bgColorClass}>{''}</FormCell>
                {result.values.map((val, i) => (
                    <FormCell key={i} className={`${bgColorClass} !justify-end`}><div className="px-1">{val.toLocaleString()}</div></FormCell>
                ))}
                <FormCell className={`${bgColorClass} !justify-end`}><div className="px-1">{total.toLocaleString()}</div></FormCell>
                <FormCell className={`${bgColorClass} !justify-end`}><div className="px-1">{moyenne.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</div></FormCell>
                <FormCell className={`${bgColorClass} !justify-end`}><div className="px-1">{result.moyenneRaisonnee.toLocaleString()}</div></FormCell>
                <FormCell colSpan={2} className={bgColorClass}>{''}</FormCell>
                <FormCell className={bgColorClass}>{''}</FormCell>
            </>
        );
    };

    return (
        <div className="bg-white p-4 rounded-lg text-sm">
            <div className="grid grid-cols-24 gap-0 mb-2">
                <FormCell colSpan={3} align="start" className="!border-none bg-gray-200 font-semibold">Affaire</FormCell>
                <FormCell colSpan={6} align="start" className="!border-none bg-gray-100">{formData.affaire}</FormCell>
                <FormCell colSpan={7} className="!border-none bg-yellow-100 font-bold text-center text-base">PLAN ANNUEL DE TRESORERIE (Historique récent - 12 derniers mois)</FormCell>
                <FormCell colSpan={8} align="right" className="!border-none bg-yellow-300 font-bold text-base">Dossier {formData.dossier}</FormCell>
                <FormCell colSpan={24} className="!border-none bg-gray-200 font-semibold">Montants à renseigner en milliers FCFA (KFCFA)</FormCell>
            </div>
            
            <div className="grid grid-cols-25 gap-0 mb-4 border-t-2 border-gray-500 text-center overflow-x-auto">
                {/* Header */}
                 <FormCell colSpan={6} align="start" className="bg-white">
                    <span className="mr-2 font-semibold">Nbre de mois renseignés</span>
                    <InputField value={String(numMonths)} onChange={e => !isReadOnly && setNumMonths(parseInt(e.target.value,10) || 0)} className="w-16 text-center" readOnly={isReadOnly} />
                    <span>mois</span>
                </FormCell>
                <FormCell colSpan={19} className="bg-white">{''}</FormCell>
                
                <FormCell colSpan={6} align="start" className="font-semibold bg-white">
                    <span className="mr-2">Solde au</span>
                    <input type="date" value={tresorerie.soldeDate} onChange={handleDateChange} className="bg-transparent outline-none text-xs px-1" readOnly={isReadOnly} />
                </FormCell>
                <FormCell className="font-semibold bg-white">KFCFA</FormCell>
                {months.map((m, i) => <FormCell key={i} className="font-semibold bg-gray-200">{m}</FormCell>)}
                <FormCell className="font-semibold bg-gray-200">Total</FormCell>
                <FormCell className="font-semibold bg-gray-200">Moyenne</FormCell>
                <FormCell className="font-semibold bg-gray-200">Moyenne Raisonnée</FormCell>
                <FormCell colSpan={2} className="font-semibold bg-gray-200">Commentaire (justification moyenne raisonnée)</FormCell>
                <FormCell className="font-semibold bg-gray-200">Action</FormCell>
                
                {/* Solde Initial */}
                <FormCell colSpan={6} align="start" className="bg-gray-300 font-bold">{`Solde cumulé fin de période`}</FormCell>
                <FormCell className="bg-gray-300"><InputField type="number" value={String(tresorerie.soldeInitial)} onChange={e => handleFieldChange('soldeInitial', parseFloat(e.target.value) || 0)} readOnly={isReadOnly} /></FormCell>
                <FormCell colSpan={18} className="bg-gray-300">{''}</FormCell>

                {/* Recettes */}
                {renderCalculatedRow("Recettes d'exploitation", calculations.recettesExploitation, 'bg-blue-300', true)}
                {renderCalculatedRow("Ventes (TTC)", calculations.recettesVentes, 'bg-blue-100')}
                {renderStaticRow("Ventes justifiées dans compte de l'entreprise", 'ventesJustifiees')}
                {renderStaticRow("Ventes ayant transités par autre compte", 'ventesAutreCompte')}
                {renderStaticRow("Ventes ayant transités par compte avec confrère", 'ventesCompteConfrere')}
                {renderDynamicSection('ventesAutres', 'une autre vente')}
                {renderDynamicSection('autresRecettes', 'une autre recette', 'bg-blue-100')}
                
                {/* Dépenses */}
                {renderCalculatedRow("Dépenses d'exploitation", calculations.depensesExploitation, 'bg-blue-300', true)}
                {renderCalculatedRow("Achats (TTC)", calculations.achatsTTC, 'bg-blue-100')}
                {renderStaticRow("Achats justifiés dans compte de l'entreprise", 'achatsJustifies')}
                {renderStaticRow("Achats ayant transités par un autre compte", 'achatsAutreCompte')}
                {renderStaticRow("Achats ayant transités par compte avec confrère", 'achatsCompteConfrere')}
                {renderDynamicSection('achatsAutres', 'un autre achat')}
                {renderDynamicSection("autresDepenses", "autre dépense", 'bg-blue-100')}
                {renderCalculatedRow("Frais de personnel", calculations.fraisPersonnel, 'bg-blue-100')}
                {renderStaticRow("Salaire/Prélèvement Dirigeant", 'salaireDirigeant')}
                {renderStaticRow("Salaires", 'salaires')}
                {renderDynamicSection("autresSalaires", "un autre salaire")}
                {renderStaticRow("CNSS", 'cnss')}
                {renderStaticRow("Impôts sur le revenu", 'impotsRevenu')}
                {renderCalculatedRow("Charges externes", calculations.chargesExternes, 'bg-blue-100')}
                {renderStaticRow("Loyer", 'loyer')}
                {renderStaticRow("Electricité", 'electricite')}
                {renderStaticRow("Transports", 'transport')}
                {renderStaticRow("Déplacements / Missions", 'deplacements')}
                {renderStaticRow("Services Extérieurs", 'servicesExterieurs')}
                {renderStaticRow("Téléphone", 'telephone')}
                {renderDynamicSection('autresCharges', 'une autre charge')}
                {renderStaticRow("Impôts et taxes (Taxe pro, TU, Enregistrement...)", 'impotsTaxes', 'bg-blue-100')}
                {renderStaticRow("Frais de Douanes", 'fraisDouanes', 'bg-blue-100')}
                {renderStaticRow("Frais Financiers", 'fraisFinanciers', 'bg-blue-100')}
                {renderStaticRow("TVA à payer", 'tvaAPayer', 'bg-blue-100')}
                
                {renderCalculatedRow("CASH-FLOW D'EXPLOITATION (A)-(B)", calculations.cashFlowExploitation, 'bg-gray-300', true)}

                {renderCalculatedRow("Ressources hors exploitation", calculations.ressourcesHorsExploitation, 'bg-blue-300', true)}
                {renderStaticRow("Emprunts (à terme)", 'emprunts', 'bg-blue-100')}
                {renderStaticRow("Augmentation de capital", 'augmentationCapital', 'bg-blue-100')}
                {renderStaticRow("Apport en compte-courant", 'apportCC', 'bg-blue-100')}
                {renderDynamicSection('autresRessources', "une autre ressource", 'bg-blue-100')}
                
                {renderCalculatedRow("Sorties hors exploitation", calculations.sortiesHorsExploitation, 'bg-blue-300', true)}
                {renderStaticRow("Remboursement emprunts", 'rembEmprunts', 'bg-blue-100')}
                {renderDynamicSection('dividendes', 'Dividende / Remb. CCA', 'bg-blue-100')}

                {renderCalculatedRow("CASH-FLOW HORS EXPLOITATION (D)-(E)", calculations.cashFlowHorsExploitation, 'bg-gray-300', true)}
                {renderCalculatedRow("CASH-FLOW DE L'ACTIVITE (C)+(F)", calculations.cashFlowActivite, 'bg-gray-300', true)}
                
                {renderStaticRow("Revenus du ménage (H)", 'revenusMenage', 'bg-blue-300')}
                {renderStaticRow("Dépenses du ménage (I)", 'depensesMenage', 'bg-blue-300')}
                {renderCalculatedRow("CASH-FLOW DU MENAGE (H)-(I)", calculations.cashFlowMenage, 'bg-gray-300', true)}

                {renderCalculatedRow("CASH-FLOW TOTAL (G)+(J)", calculations.cashFlowTotal, 'bg-gray-400', true)}
                {renderCalculatedRow("Solde cumulé fin de période", {values: calculations.soldeCumule, moyenneRaisonnee: 0}, 'bg-gray-400', true)}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
                <div>
                    <h3 className="font-bold bg-blue-200 p-2 border border-gray-400">JUSTIFICATIONS (PLAN ANNUEL DE TRESORERIE) - Ventes</h3>
                    <TextArea value={tresorerie.justificationVentes} onChange={e => handleFieldChange('justificationVentes', e.target.value)} rows={6} placeholder="Justifier ici..." readOnly={isReadOnly} />
                </div>
                <div>
                    <h3 className="font-bold bg-blue-200 p-2 border border-gray-400">JUSTIFICATIONS - Achats</h3>
                    <TextArea value={tresorerie.justificationAchats} onChange={e => handleFieldChange('justificationAchats', e.target.value)} rows={6} placeholder="Justifier ici..." readOnly={isReadOnly} />
                </div>
                <div>
                    <h3 className="font-bold bg-blue-200 p-2 border border-gray-400">JUSTIFICATIONS - Autres flux</h3>
                    <TextArea value={tresorerie.justificationAutresFlux} onChange={e => handleFieldChange('justificationAutresFlux', e.target.value)} rows={6} placeholder="Justifier ici..." readOnly={isReadOnly} />
                </div>
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

export default TresoreriePage;