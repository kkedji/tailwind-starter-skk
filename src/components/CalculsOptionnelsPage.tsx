
import React, { useMemo } from 'react';
import { CreditApplicationData, CalculsOptionnelsData, AnalyseVentesRow, AnalyseAchatsRow, AnalyseMargesRow } from '../types.ts';

interface CalculsOptionnelsPageProps {
  formData: CreditApplicationData;
  setFormData: React.Dispatch<React.SetStateAction<CreditApplicationData>>;
  onSubmit: () => void;
  isReadOnly?: boolean;
}

const FormCell = ({ children, className = '', colSpan = 1, rowSpan = 1, isHeader = false, isSubHeader = false, isTitle = false, align = 'center', style: customStyle }: { children: any, className?: string, colSpan?: number, rowSpan?: number, isHeader?: boolean, isSubHeader?: boolean, isTitle?: boolean, align?: string, style?: React.CSSProperties }) => {
    const baseClasses = 'border border-black p-1 text-xs flex items-center';
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
    <input type={type} name={name} value={value ?? ''} onChange={onChange} readOnly={readOnly} className={`w-full h-full bg-transparent outline-none text-xs px-1 ${readOnly ? 'text-right' : 'text-left'} ${className}`} {...rest} />
);

const ActionButton = ({ onClick, children, className = '' }) => (
    <button type="button" onClick={onClick} className={`text-xs px-2 py-1 rounded ${className}`}>
        {children}
    </button>
);

type TableKey = keyof CalculsOptionnelsData;

const CalculsOptionnelsPage: React.FC<CalculsOptionnelsPageProps> = ({ formData, setFormData, onSubmit, isReadOnly = false }) => {

    const { calculsOptionnels } = formData;
    
    const handleTableChange = <T,>(section: TableKey, index: number, field: keyof T, value: any) => {
        if (isReadOnly) return;
        setFormData(prev => {
            const newTableData = [...prev.calculsOptionnels[section] as any[]];
            const currentItem = newTableData[index];
            const fieldType = typeof currentItem[field];
            const finalValue = fieldType === 'number' ? parseFloat(value) || 0 : value;
            
            newTableData[index] = { ...currentItem, [field]: finalValue };
            
            return {
                ...prev,
                calculsOptionnels: {
                    ...prev.calculsOptionnels,
                    [section]: newTableData
                }
            };
        });
    };
    
    const addRow = (section: TableKey) => {
        if (isReadOnly) return;
        let newRow: any;
        const id = Date.now().toString();
        if (section === 'ventes') {
            newRow = { id, nomProduit: '', quantite: 0, prixVenteUnitaire: 0, tva: 18 };
        } else if (section === 'achats') {
            newRow = { id, nomProduit: '', quantite: 0, prixAchatUnitaire: 0, tva: 18, fournisseur: '' };
        } else { // marges
            newRow = { id, nomProduit: '', quantite: 0, prixAchatUnitaire: 0, prixVenteUnitaire: 0 };
        }

        setFormData(prev => ({
            ...prev,
            calculsOptionnels: {
                ...prev.calculsOptionnels,
                [section]: [...prev.calculsOptionnels[section], newRow]
            }
        }));
    };
    
    const removeRow = (section: TableKey, index: number) => {
        if (isReadOnly) return;
        setFormData(prev => ({
            ...prev,
            calculsOptionnels: {
                ...prev.calculsOptionnels,
                [section]: prev.calculsOptionnels[section].filter((_, i) => i !== index)
            }
        }));
    };

    const totals = useMemo(() => {
        const ventes = calculsOptionnels.ventes.reduce((acc, row) => {
            const totalHT = row.quantite * row.prixVenteUnitaire;
            acc.totalHT += totalHT;
            acc.totalTTC += totalHT * (1 + row.tva / 100);
            return acc;
        }, { totalHT: 0, totalTTC: 0 });

        const achats = calculsOptionnels.achats.reduce((acc, row) => {
            const totalHT = row.quantite * row.prixAchatUnitaire;
            acc.totalHT += totalHT;
            acc.totalTTC += totalHT * (1 + row.tva / 100);
            return acc;
        }, { totalHT: 0, totalTTC: 0 });

        const marges = calculsOptionnels.marges.reduce((acc, row) => {
            const achatsHT = row.quantite * row.prixAchatUnitaire;
            const ventesHT = row.quantite * row.prixVenteUnitaire;
            const margeTotale = ventesHT - achatsHT;

            acc.achatsTotaux += achatsHT;
            acc.ventesTotales += ventesHT;
            acc.margeTotale += margeTotale;
            return acc;
        }, { achatsTotaux: 0, ventesTotales: 0, margeTotale: 0 });
        
        const margeMoyenne = marges.ventesTotales > 0 ? (marges.margeTotale / marges.ventesTotales) * 100 : 0;

        return { ventes, achats, marges, margeMoyenne };
    }, [calculsOptionnels]);
    
    return (
        <div className="bg-white p-4 rounded-lg text-sm">
            {/* Header */}
            <div className="grid grid-cols-24 gap-0 mb-2">
                <FormCell colSpan={3} isHeader align="left">Affaire</FormCell>
                <FormCell colSpan={5} isSubHeader align="left">{formData.affaire}</FormCell>
                <FormCell colSpan={8} isHeader className="text-center font-bold text-base" style={{backgroundColor: '#DDE2B6'}}>CALCULS OPTIONNELS</FormCell>
                <FormCell colSpan={8} isHeader className="text-right font-bold">Dossier {formData.dossier}</FormCell>
                <FormCell colSpan={24} className="bg-red-200 text-red-800 text-center font-semibold">Modèles de tableaux à utiliser si nécessaire pour justifier les calculs effectués pour compléter le tableau de trésorerie</FormCell>
            </div>

            {/* Analyse des Ventes */}
            <div className="grid grid-cols-12 gap-0 mb-4 border-t-2 border-black">
                <FormCell colSpan={12} isTitle>ANALYSE DES VENTES</FormCell>
                <FormCell colSpan={4} isHeader>Nom du produit</FormCell>
                <FormCell colSpan={2} isHeader>Quantité</FormCell>
                <FormCell colSpan={2} isHeader>Prix de vente unitaire</FormCell>
                <FormCell colSpan={1} isHeader>Prix total HT</FormCell>
                <FormCell colSpan={1} isHeader>TVA (%)</FormCell>
                <FormCell colSpan={1} isHeader>Prix total TTC</FormCell>
                <FormCell colSpan={1} isHeader>Action</FormCell>
                {calculsOptionnels.ventes.map((row, index) => {
                    const totalHT = row.quantite * row.prixVenteUnitaire;
                    const totalTTC = totalHT * (1 + row.tva / 100);
                    return (
                        <React.Fragment key={row.id}>
                            <FormCell colSpan={4}><InputField readOnly={isReadOnly} value={row.nomProduit} onChange={e => handleTableChange<AnalyseVentesRow>('ventes', index, 'nomProduit', e.target.value)} /></FormCell>
                            <FormCell colSpan={2}><InputField readOnly={isReadOnly} type="number" value={String(row.quantite)} onChange={e => handleTableChange<AnalyseVentesRow>('ventes', index, 'quantite', e.target.value)} /></FormCell>
                            <FormCell colSpan={2}><InputField readOnly={isReadOnly} type="number" value={String(row.prixVenteUnitaire)} onChange={e => handleTableChange<AnalyseVentesRow>('ventes', index, 'prixVenteUnitaire', e.target.value)} /></FormCell>
                            <FormCell colSpan={1} align="right">{totalHT.toLocaleString()}</FormCell>
                            <FormCell colSpan={1}><InputField readOnly={isReadOnly} type="number" value={String(row.tva)} onChange={e => handleTableChange<AnalyseVentesRow>('ventes', index, 'tva', e.target.value)} /></FormCell>
                            <FormCell colSpan={1} align="right">{Math.round(totalTTC).toLocaleString()}</FormCell>
                            <FormCell colSpan={1}>{!isReadOnly && <ActionButton onClick={() => removeRow('ventes', index)} className="text-red-500 hover:bg-red-100 w-full">[-]</ActionButton>}</FormCell>
                        </React.Fragment>
                    )
                })}
                {!isReadOnly && <FormCell colSpan={12}><ActionButton onClick={() => addRow('ventes')} className="text-green-600 hover:bg-green-100 w-full">[+]</ActionButton></FormCell>}
                <FormCell colSpan={8} isHeader>TOTAL</FormCell>
                <FormCell colSpan={1} isHeader align="right">{totals.ventes.totalHT.toLocaleString()}</FormCell>
                <FormCell colSpan={1}>{''}</FormCell>
                <FormCell colSpan={1} isHeader align="right">{Math.round(totals.ventes.totalTTC).toLocaleString()}</FormCell>
                <FormCell colSpan={1}>{''}</FormCell>
            </div>

            {/* Analyse des Achats */}
            <div className="grid grid-cols-13 gap-0 mb-4 border-t-2 border-black">
                <FormCell colSpan={13} isTitle>ANALYSE DES ACHATS</FormCell>
                <FormCell colSpan={3} isHeader>Nom du produit</FormCell>
                <FormCell colSpan={1} isHeader>Quantité</FormCell>
                <FormCell colSpan={2} isHeader>Prix d'achat unitaire (FCFA)</FormCell>
                <FormCell colSpan={2} isHeader>Coût total HT (FCFA)</FormCell>
                <FormCell colSpan={1} isHeader>TVA (%)</FormCell>
                <FormCell colSpan={2} isHeader>Coût total TTC (FCFA)</FormCell>
                <FormCell colSpan={1} isHeader>Fournisseur</FormCell>
                <FormCell colSpan={1} isHeader>Action</FormCell>
                 {calculsOptionnels.achats.map((row, index) => {
                    const totalHT = row.quantite * row.prixAchatUnitaire;
                    const totalTTC = totalHT * (1 + row.tva / 100);
                    return (
                        <React.Fragment key={row.id}>
                            <FormCell colSpan={3}><InputField readOnly={isReadOnly} value={row.nomProduit} onChange={e => handleTableChange<AnalyseAchatsRow>('achats', index, 'nomProduit', e.target.value)} /></FormCell>
                            <FormCell colSpan={1}><InputField readOnly={isReadOnly} type="number" value={String(row.quantite)} onChange={e => handleTableChange<AnalyseAchatsRow>('achats', index, 'quantite', e.target.value)} /></FormCell>
                            <FormCell colSpan={2}><InputField readOnly={isReadOnly} type="number" value={String(row.prixAchatUnitaire)} onChange={e => handleTableChange<AnalyseAchatsRow>('achats', index, 'prixAchatUnitaire', e.target.value)} /></FormCell>
                            <FormCell colSpan={2} align="right">{totalHT.toLocaleString()}</FormCell>
                            <FormCell colSpan={1}><InputField readOnly={isReadOnly} type="number" value={String(row.tva)} onChange={e => handleTableChange<AnalyseAchatsRow>('achats', index, 'tva', e.target.value)} /></FormCell>
                            <FormCell colSpan={2} align="right">{Math.round(totalTTC).toLocaleString()}</FormCell>
                            <FormCell colSpan={1}><InputField readOnly={isReadOnly} value={row.fournisseur} onChange={e => handleTableChange<AnalyseAchatsRow>('achats', index, 'fournisseur', e.target.value)} /></FormCell>
                            <FormCell colSpan={1}>{!isReadOnly && <ActionButton onClick={() => removeRow('achats', index)} className="text-red-500 hover:bg-red-100 w-full">[-]</ActionButton>}</FormCell>
                        </React.Fragment>
                    )
                })}
                {!isReadOnly && <FormCell colSpan={13}><ActionButton onClick={() => addRow('achats')} className="text-green-600 hover:bg-green-100 w-full">[+]</ActionButton></FormCell>}
                <FormCell colSpan={6} isHeader>TOTAL</FormCell>
                <FormCell colSpan={2} isHeader align="right">{totals.achats.totalHT.toLocaleString()}</FormCell>
                <FormCell colSpan={1}>{''}</FormCell>
                <FormCell colSpan={2} isHeader align="right">{Math.round(totals.achats.totalTTC).toLocaleString()}</FormCell>
                <FormCell colSpan={2}>{''}</FormCell>
            </div>

            {/* Analyse des Marges */}
            <div className="grid grid-cols-20 gap-0 mb-4 border-t-2 border-black">
                <FormCell colSpan={20} isTitle>ANALYSE DES MARGES (sur activités de négoce)</FormCell>
                <FormCell colSpan={3} isHeader>Nom du produit</FormCell>
                <FormCell colSpan={1} isHeader>Quantité</FormCell>
                <FormCell colSpan={2} isHeader>Prix d'achat unitaire (HT)</FormCell>
                <FormCell colSpan={2} isHeader>Achats totaux (HT)</FormCell>
                <FormCell colSpan={2} isHeader>Prix de vente unitaire (HT)</FormCell>
                <FormCell colSpan={2} isHeader>Ventes totales (HT)</FormCell>
                <FormCell colSpan={2} isHeader>Marge unitaire</FormCell>
                <FormCell colSpan={2} isHeader>Marge totale</FormCell>
                <FormCell colSpan={1} isHeader>% Marge unitaire</FormCell>
                <FormCell colSpan={1} isHeader>% Marge pondérée</FormCell>
                <FormCell colSpan={1} isHeader>Action</FormCell>
                {calculsOptionnels.marges.map((row, index) => {
                     const achatsHT = row.quantite * row.prixAchatUnitaire;
                     const ventesHT = row.quantite * row.prixVenteUnitaire;
                     const margeUnitaire = row.prixVenteUnitaire - row.prixAchatUnitaire;
                     const margeTotale = ventesHT - achatsHT;
                     const pctMargeUnitaire = row.prixVenteUnitaire > 0 ? (margeUnitaire / row.prixVenteUnitaire) * 100 : 0;
                     const pctMargePonderee = ventesHT > 0 ? (margeTotale / ventesHT) * 100 : 0;
                    return (
                        <React.Fragment key={row.id}>
                            <FormCell colSpan={3}><InputField readOnly={isReadOnly} value={row.nomProduit} onChange={e => handleTableChange<AnalyseMargesRow>('marges', index, 'nomProduit', e.target.value)} /></FormCell>
                            <FormCell colSpan={1}><InputField readOnly={isReadOnly} type="number" value={String(row.quantite)} onChange={e => handleTableChange<AnalyseMargesRow>('marges', index, 'quantite', e.target.value)} /></FormCell>
                            <FormCell colSpan={2}><InputField readOnly={isReadOnly} type="number" value={String(row.prixAchatUnitaire)} onChange={e => handleTableChange<AnalyseMargesRow>('marges', index, 'prixAchatUnitaire', e.target.value)} /></FormCell>
                            <FormCell colSpan={2} align="right">{achatsHT.toLocaleString()}</FormCell>
                            <FormCell colSpan={2}><InputField readOnly={isReadOnly} type="number" value={String(row.prixVenteUnitaire)} onChange={e => handleTableChange<AnalyseMargesRow>('marges', index, 'prixVenteUnitaire', e.target.value)} /></FormCell>
                            <FormCell colSpan={2} align="right">{ventesHT.toLocaleString()}</FormCell>
                            <FormCell colSpan={2} align="right">{margeUnitaire.toLocaleString()}</FormCell>
                            <FormCell colSpan={2} align="right">{margeTotale.toLocaleString()}</FormCell>
                            <FormCell colSpan={1} align="right">{isFinite(pctMargeUnitaire) ? `${pctMargeUnitaire.toFixed(0)}%` : 'N/A'}</FormCell>
                            <FormCell colSpan={1} align="right">{isFinite(pctMargePonderee) ? `${pctMargePonderee.toFixed(0)}%` : '#DIV/0!'}</FormCell>
                            <FormCell colSpan={1}>{!isReadOnly && <ActionButton onClick={() => removeRow('marges', index)} className="text-red-500 hover:bg-red-100 w-full">[-]</ActionButton>}</FormCell>
                        </React.Fragment>
                    )
                })}
                {!isReadOnly && <FormCell colSpan={20}><ActionButton onClick={() => addRow('marges')} className="text-green-600 hover:bg-green-100 w-full">[+]</ActionButton></FormCell>}
                <FormCell colSpan={6} isHeader>TOTAL</FormCell>
                <FormCell colSpan={2} isHeader align="right">{totals.marges.achatsTotaux.toLocaleString()}</FormCell>
                <FormCell colSpan={2}>{''}</FormCell>
                <FormCell colSpan={2} isHeader align="right">{totals.marges.ventesTotales.toLocaleString()}</FormCell>
                <FormCell colSpan={2}>{''}</FormCell>
                <FormCell colSpan={2} isHeader align="right">{totals.marges.margeTotale.toLocaleString()}</FormCell>
                <FormCell colSpan={1} isHeader align="right">MARGE MOYENNE</FormCell>
                <FormCell colSpan={1} isHeader align="right">{isFinite(totals.margeMoyenne) ? `${totals.margeMoyenne.toFixed(0)}%` : '#DIV/0!'}</FormCell>
                 <FormCell colSpan={1}>{''}</FormCell>
            </div>

            <div className="flex justify-end mt-6">
                 {!isReadOnly && (
                    <button type="button" onClick={onSubmit} className="bg-green-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 transition duration-200">
                        Soumettre à l'analyse
                    </button>
                 )}
            </div>
        </div>
    );
};

export default CalculsOptionnelsPage;
