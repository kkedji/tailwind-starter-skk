

import React from 'react';
import { CreditApplicationData, ProduitService, ClientPrincipal, FournisseurPrincipal } from '../types.ts';

interface ActiviteMarchePageProps {
  formData: CreditApplicationData;
  setFormData: React.Dispatch<React.SetStateAction<CreditApplicationData>>;
  onNext: () => void;
  isReadOnly?: boolean;
}

const FormCell = ({ children, className = '', colSpan = 1, rowSpan = 1, isHeader = false, isSubHeader = false, isTitle = false, isLabel = false }: { children: any, className?: string, colSpan?: number, rowSpan?: number, isHeader?: boolean, isSubHeader?: boolean, isTitle?: boolean, isLabel?: boolean }) => {
    const baseClasses = 'border border-gray-400 p-1 text-xs flex items-center';
    const bgClasses = isTitle ? 'bg-yellow-400 font-bold' : isHeader ? 'bg-gray-200 font-semibold' : isSubHeader ? 'bg-gray-100 font-semibold' : 'bg-white';
    const alignClasses = isLabel ? 'justify-start' : 'justify-center';
    const style = {
        gridColumn: `span ${colSpan} / span ${colSpan}`,
        gridRow: `span ${rowSpan} / span ${rowSpan}`,
    };
    return <div style={style} className={`${baseClasses} ${bgClasses} ${className} ${alignClasses}`}>{children}</div>;
};

const InputField = ({ value, onChange, name = '', type = 'text', className = '', readOnly = false, ...rest }) => (
    <input type={type} name={name} value={value ?? ''} onChange={onChange} readOnly={readOnly} className={`w-full h-full bg-transparent outline-none text-xs px-1 ${readOnly ? 'bg-gray-100 cursor-not-allowed' : ''} ${className}`} {...rest} />
);

const TextAreaField = ({ value, onChange, name, className = '', rows = 2, readOnly = false, placeholder = '' }) => (
    <textarea name={name} value={value ?? ''} onChange={onChange} rows={rows} readOnly={readOnly} placeholder={placeholder} className={`w-full h-full bg-transparent outline-none text-xs p-1 ${readOnly ? 'bg-gray-100 cursor-not-allowed' : ''} ${className}`} />
);

const ActionButton = ({ onClick, children, className = '' }) => (
    <button type="button" onClick={onClick} className={`text-xs px-2 py-1 rounded ${className}`}>
        {children}
    </button>
);

type ActiviteMarcheObjectKeys = 'caracteristiquesMarche' | 'politiqueVentes' | 'gestionProduction' | 'politiqueAchats';
type ActiviteMarcheArrayKeys = 'produitsServices' | 'clients' | 'fournisseurs';

const ActiviteMarchePage: React.FC<ActiviteMarchePageProps> = ({ formData, setFormData, onNext, isReadOnly = false }) => {
    const { activiteMarche } = formData;
    
    const handleFieldChange = (section: ActiviteMarcheObjectKeys, field: any, value: any) => {
        if (isReadOnly) return;
        setFormData(prev => ({
            ...prev,
            activiteMarche: {
                ...prev.activiteMarche,
                [section]: {
                    ...prev.activiteMarche[section],
                    [field]: value
                }
            }
        }));
    };
    
    const handleSyntheseChange = (value: string) => {
         if (isReadOnly) return;
         setFormData(prev => ({
            ...prev,
            activiteMarche: {
                ...prev.activiteMarche,
                synthese: value,
            }
        }));
    };

    const handleTableChange = <T,>(section: ActiviteMarcheArrayKeys, index: number, field: keyof T, value: any) => {
        if (isReadOnly) return;
        setFormData(prev => {
            const newTableData = [...prev.activiteMarche[section] as any[]];
            const currentItem = newTableData[index];
            const fieldType = typeof currentItem[field];
            const finalValue = fieldType === 'number' ? parseFloat(value) || 0 : value;
            
            newTableData[index] = { ...currentItem, [field]: finalValue };
            
            return {
                ...prev,
                activiteMarche: {
                    ...prev.activiteMarche,
                    [section]: newTableData
                }
            };
        });
    };
    
    const addRow = <T extends { id: string }>(section: ActiviteMarcheArrayKeys, newRowData: Omit<T, 'id'>) => {
        if (isReadOnly) return;
        const newRow = { ...newRowData, id: Date.now().toString() } as T;
        setFormData(prev => ({
            ...prev,
            activiteMarche: {
                ...prev.activiteMarche,
                [section]: [...prev.activiteMarche[section], newRow]
            }
        }));
    };

    const removeRow = (section: ActiviteMarcheArrayKeys, index: number) => {
        if (isReadOnly) return;
        setFormData(prev => ({
            ...prev,
            activiteMarche: {
                ...prev.activiteMarche,
                [section]: prev.activiteMarche[section].filter((_, i) => i !== index)
            }
        }));
    };

    const newProduitServiceTemplate: Omit<ProduitService, 'id'> = { produitService: '', total: 0, negocePct: 0, productionPct: 0, localePct: 0, exportPct: 0, quantites: 0, unitesMesure: '' };
    const newClientTemplate: Omit<ClientPrincipal, 'id'> = { denomination: '', rc: '', ville: '', ventesPct: 0 };
    const newFournisseurTemplate: Omit<FournisseurPrincipal, 'id'> = { denomination: '', ville: '', achatsPct: 0 };

    return (
        <div className="bg-white p-4 rounded-lg text-sm">
            {/* Header */}
            <div className="grid grid-cols-24 gap-0 mb-2">
                <FormCell colSpan={2} isTitle>Affaire</FormCell>
                <FormCell colSpan={6} isSubHeader>{formData.affaire}</FormCell>
                <FormCell colSpan={8} isTitle className="bg-green-200 text-center font-bold text-base">Activité et marché</FormCell>
                <FormCell colSpan={8} isTitle className="text-right font-bold">Dossier {formData.dossier}</FormCell>
                <FormCell colSpan={4} isHeader>Date ouverture du dossier</FormCell>
                <FormCell colSpan={4}><InputField type="date" name="dateOuvertureDossier" value={formData.dateOuvertureDossier} onChange={e => setFormData({...formData, dateOuvertureDossier: e.target.value})} readOnly={isReadOnly} /></FormCell>
            </div>
            
            {/* Description de l'activité */}
            <div className="grid grid-cols-13 gap-0 mb-2 border-t-4 border-gray-500">
                <FormCell colSpan={4} isHeader rowSpan={2} className="text-left">
                    <div className="w-full">
                        <p className="font-bold">Description de l'activité</p>
                        <p>Produits / Services</p>
                        <p className="text-red-600">(cf. onglet calculs optionnels si nécessaire)</p>
                    </div>
                </FormCell>
                <FormCell colSpan={1} isHeader>Chiffre d'affaires (en KFCFA)</FormCell>
                <FormCell colSpan={4} isHeader>Répartition du chiffre d'affaires</FormCell>
                <FormCell colSpan={2} isHeader>Volumes / Unités de mesure</FormCell>
                <FormCell colSpan={2} isHeader>Action</FormCell>

                <FormCell isSubHeader>Total</FormCell>
                <FormCell isSubHeader>% Négoce</FormCell>
                <FormCell isSubHeader>% Production</FormCell>
                <FormCell isSubHeader>% Locale</FormCell>
                <FormCell isSubHeader>% Export</FormCell>
                <FormCell isSubHeader>Quantités</FormCell>
                <FormCell isSubHeader>Unités</FormCell>
                 <FormCell colSpan={2}>{''}</FormCell>
                
                 {activiteMarche.produitsServices.map((item, index) => (
                    <React.Fragment key={item.id}>
                        <FormCell colSpan={4}><InputField name="produitService" value={item.produitService} onChange={e => handleTableChange<ProduitService>('produitsServices', index, 'produitService', e.target.value)} readOnly={isReadOnly}/></FormCell>
                        <FormCell><InputField type="number" name="total" value={String(item.total)} onChange={e => handleTableChange<ProduitService>('produitsServices', index, 'total', e.target.value)} readOnly={isReadOnly}/></FormCell>
                        <FormCell><InputField type="number" name="negocePct" value={String(item.negocePct)} onChange={e => handleTableChange<ProduitService>('produitsServices', index, 'negocePct', e.target.value)} readOnly={isReadOnly}/></FormCell>
                        <FormCell><InputField type="number" name="productionPct" value={String(item.productionPct)} onChange={e => handleTableChange<ProduitService>('produitsServices', index, 'productionPct', e.target.value)} readOnly={isReadOnly}/></FormCell>
                        <FormCell><InputField type="number" name="localePct" value={String(item.localePct)} onChange={e => handleTableChange<ProduitService>('produitsServices', index, 'localePct', e.target.value)} readOnly={isReadOnly}/></FormCell>
                        <FormCell><InputField type="number" name="exportPct" value={String(item.exportPct)} onChange={e => handleTableChange<ProduitService>('produitsServices', index, 'exportPct', e.target.value)} readOnly={isReadOnly}/></FormCell>
                        <FormCell><InputField type="number" name="quantites" value={String(item.quantites)} onChange={e => handleTableChange<ProduitService>('produitsServices', index, 'quantites', e.target.value)} readOnly={isReadOnly}/></FormCell>
                        <FormCell><InputField name="unitesMesure" value={item.unitesMesure} onChange={e => handleTableChange<ProduitService>('produitsServices', index, 'unitesMesure', e.target.value)} readOnly={isReadOnly}/></FormCell>
                        <FormCell colSpan={2}>{!isReadOnly && <ActionButton onClick={() => removeRow('produitsServices', index)} className="text-red-500 hover:bg-red-100 w-full">[-]</ActionButton>}</FormCell>
                    </React.Fragment>
                ))}
                 {!isReadOnly && <FormCell colSpan={13}>
                     <ActionButton onClick={() => addRow<ProduitService>('produitsServices', newProduitServiceTemplate)} className="text-green-600 hover:bg-green-100 w-full">[+] Ajouter une ligne</ActionButton>
                 </FormCell>}
            </div>

            {/* Clients & Fournisseurs */}
            <div className="grid grid-cols-24 gap-0 mb-2 border-t-2 border-gray-400">
                <div style={{gridColumn: 'span 12'}} className="border-r border-gray-400">
                    <div className="grid grid-cols-12 gap-0">
                        <FormCell colSpan={12} isHeader>Principaux clients</FormCell>
                        <FormCell colSpan={4} isSubHeader>Dénomination</FormCell>
                        <FormCell colSpan={3} isSubHeader>RC (ou n°cpte)</FormCell>
                        <FormCell colSpan={3} isSubHeader>Ville</FormCell>
                        <FormCell colSpan={1} isSubHeader>% Ventes</FormCell>
                        <FormCell colSpan={1} isSubHeader>Act.</FormCell>
                        {activiteMarche.clients.map((client, index) => (
                            <React.Fragment key={client.id}>
                                <FormCell colSpan={4}><InputField name="denomination" value={client.denomination} onChange={e => handleTableChange<ClientPrincipal>('clients', index, 'denomination', e.target.value)} readOnly={isReadOnly} /></FormCell>
                                <FormCell colSpan={3}><InputField name="rc" value={client.rc} onChange={e => handleTableChange<ClientPrincipal>('clients', index, 'rc', e.target.value)} readOnly={isReadOnly} /></FormCell>
                                <FormCell colSpan={3}><InputField name="ville" value={client.ville} onChange={e => handleTableChange<ClientPrincipal>('clients', index, 'ville', e.target.value)} readOnly={isReadOnly} /></FormCell>
                                <FormCell colSpan={1}><InputField type="number" name="ventesPct" value={String(client.ventesPct)} onChange={e => handleTableChange<ClientPrincipal>('clients', index, 'ventesPct', e.target.value)} readOnly={isReadOnly} /></FormCell>
                                <FormCell colSpan={1}>{!isReadOnly && <ActionButton onClick={() => removeRow('clients', index)} className="text-red-500 hover:bg-red-100 w-full">[-]</ActionButton>}</FormCell>
                            </React.Fragment>
                        ))}
                         {!isReadOnly && <FormCell colSpan={12}>
                            <ActionButton onClick={() => addRow<ClientPrincipal>('clients', newClientTemplate)} className="text-green-600 hover:bg-green-100 w-full">[+]</ActionButton>
                        </FormCell>}
                    </div>
                </div>
                <div style={{gridColumn: 'span 12'}}>
                    <div className="grid grid-cols-12 gap-0">
                         <FormCell colSpan={12} isHeader>Principaux fournisseurs</FormCell>
                        <FormCell colSpan={6} isSubHeader>Dénomination</FormCell>
                        <FormCell colSpan={3} isSubHeader>Ville</FormCell>
                        <FormCell colSpan={2} isSubHeader>% Achats</FormCell>
                        <FormCell colSpan={1} isSubHeader>Act.</FormCell>
                         {activiteMarche.fournisseurs.map((fournisseur, index) => (
                            <React.Fragment key={fournisseur.id}>
                                <FormCell colSpan={6}><InputField name="denomination" value={fournisseur.denomination} onChange={e => handleTableChange<FournisseurPrincipal>('fournisseurs', index, 'denomination', e.target.value)} readOnly={isReadOnly} /></FormCell>
                                <FormCell colSpan={3}><InputField name="ville" value={fournisseur.ville} onChange={e => handleTableChange<FournisseurPrincipal>('fournisseurs', index, 'ville', e.target.value)} readOnly={isReadOnly} /></FormCell>
                                <FormCell colSpan={2}><InputField type="number" name="achatsPct" value={String(fournisseur.achatsPct)} onChange={e => handleTableChange<FournisseurPrincipal>('fournisseurs', index, 'achatsPct', e.target.value)} readOnly={isReadOnly} /></FormCell>
                                <FormCell colSpan={1}>{!isReadOnly && <ActionButton onClick={() => removeRow('fournisseurs', index)} className="text-red-500 hover:bg-red-100 w-full">[-]</ActionButton>}</FormCell>
                            </React.Fragment>
                        ))}
                         {!isReadOnly && <FormCell colSpan={12}>
                             <ActionButton onClick={() => addRow<FournisseurPrincipal>('fournisseurs', newFournisseurTemplate)} className="text-green-600 hover:bg-green-100 w-full">[+]</ActionButton>
                         </FormCell>}
                    </div>
                </div>
            </div>

            {/* Caractéristiques, Politiques, Gestion */}
            <div className="grid grid-cols-24 gap-0 border-t-2 border-gray-400">
                {/* LEFT SIDE */}
                <div style={{gridColumn: 'span 12'}} className="border-r border-gray-400">
                    <div className="grid grid-cols-12 gap-0">
                        <FormCell colSpan={12} isHeader>Caractéristiques Marché et Positionnement Entreprise</FormCell>
                        <FormCell colSpan={6} rowSpan={2} isLabel className="bg-gray-100">Taille du marché, concurrence, évolution</FormCell>
                        <FormCell colSpan={6} rowSpan={2}><TextAreaField rows={4} name="tailleConcurrence" value={activiteMarche.caracteristiquesMarche.tailleConcurrence} onChange={e => handleFieldChange('caracteristiquesMarche', 'tailleConcurrence', e.target.value)} readOnly={isReadOnly} /></FormCell>
                        <FormCell colSpan={6} rowSpan={2} isLabel className="bg-gray-100">Sensibilité au climat, réglementation, environnement</FormCell>
                        <FormCell colSpan={6} rowSpan={2}><TextAreaField rows={4} name="sensibiliteClimat" value={activiteMarche.caracteristiquesMarche.sensibiliteClimat} onChange={e => handleFieldChange('caracteristiquesMarche', 'sensibiliteClimat', e.target.value)} readOnly={isReadOnly} /></FormCell>
                        <FormCell colSpan={6} rowSpan={2} isLabel className="bg-gray-100">Positionnement de l'entreprise: part du marché, prix, qualité, créativité</FormCell>
                        <FormCell colSpan={6} rowSpan={2}><TextAreaField rows={4} name="positionnement" value={activiteMarche.caracteristiquesMarche.positionnement} onChange={e => handleFieldChange('caracteristiquesMarche', 'positionnement', e.target.value)} readOnly={isReadOnly} /></FormCell>
                        
                        <FormCell colSpan={12} isHeader>Gestion de la production et des stocks</FormCell>
                        <FormCell colSpan={6} rowSpan={2} isLabel className="bg-gray-100">Organisation, répartition des tâches, optimisation, performance</FormCell>
                        <FormCell colSpan={6} rowSpan={2}><TextAreaField rows={4} name="organisation" value={activiteMarche.gestionProduction.organisation} onChange={e => handleFieldChange('gestionProduction', 'organisation', e.target.value)} readOnly={isReadOnly} /></FormCell>
                        <FormCell colSpan={6} rowSpan={2} isLabel className="bg-gray-100">Gestion des risques: énergie, panne, accidents, évolution de technologie</FormCell>
                        <FormCell colSpan={6} rowSpan={2}><TextAreaField rows={4} name="gestionRisques" value={activiteMarche.gestionProduction.gestionRisques} onChange={e => handleFieldChange('gestionProduction', 'gestionRisques', e.target.value)} readOnly={isReadOnly} /></FormCell>
                        <FormCell colSpan={6} rowSpan={2} isLabel className="bg-gray-100">Gestion des stocks: stock de sécurité</FormCell>
                        <FormCell colSpan={6} rowSpan={2}><TextAreaField rows={4} name="gestionStocks" value={activiteMarche.gestionProduction.gestionStocks} onChange={e => handleFieldChange('gestionProduction', 'gestionStocks', e.target.value)} readOnly={isReadOnly} /></FormCell>
                    </div>
                </div>

                {/* RIGHT SIDE */}
                <div style={{gridColumn: 'span 12'}}>
                     <div className="grid grid-cols-12 gap-0">
                        <FormCell colSpan={12} isHeader>Politique des ventes</FormCell>
                        <FormCell colSpan={6} rowSpan={2} isLabel className="bg-gray-100">Diversification du PTF clients, fidélisation des clients (ancienneté clients)</FormCell>
                        <FormCell colSpan={6} rowSpan={2}><TextAreaField rows={4} name="diversificationPTF" value={activiteMarche.politiqueVentes.diversificationPTF} onChange={e => handleFieldChange('politiqueVentes', 'diversificationPTF', e.target.value)} readOnly={isReadOnly}/></FormCell>
                        <FormCell colSpan={6} rowSpan={2} isLabel className="bg-gray-100">Veille concurrentielle, action marketing, prospection, communication, ...</FormCell>
                        <FormCell colSpan={6} rowSpan={2}><TextAreaField rows={4} name="veilleConcurrentielle" value={activiteMarche.politiqueVentes.veilleConcurrentielle} onChange={e => handleFieldChange('politiqueVentes', 'veilleConcurrentielle', e.target.value)} readOnly={isReadOnly}/></FormCell>
                        <FormCell colSpan={6} rowSpan={2} isLabel className="bg-gray-100">Détermination des objectifs de ventes, recouvrement des créances, délais de paiement</FormCell>
                        <FormCell colSpan={6} rowSpan={2}><TextAreaField rows={4} name="determinationObjectifs" value={activiteMarche.politiqueVentes.determinationObjectifs} onChange={e => handleFieldChange('politiqueVentes', 'determinationObjectifs', e.target.value)} readOnly={isReadOnly}/></FormCell>
                        
                        <FormCell colSpan={12} isHeader>Politique des achats</FormCell>
                        <FormCell colSpan={6} rowSpan={2} isLabel className="bg-gray-100">Diversification des Fournisseurs, matières, planification des approvisionnements</FormCell>
                        <FormCell colSpan={6} rowSpan={2}><TextAreaField rows={4} name="diversificationFournisseurs" value={activiteMarche.politiqueAchats.diversificationFournisseurs} onChange={e => handleFieldChange('politiqueAchats', 'diversificationFournisseurs', e.target.value)} readOnly={isReadOnly}/></FormCell>
                        <FormCell colSpan={6} rowSpan={2} isLabel className="bg-gray-100">Négociation des prix, délais, ristourne, rabais, délais de paiement</FormCell>
                        <FormCell colSpan={6} rowSpan={2}><TextAreaField rows={4} name="negociationPrix" value={activiteMarche.politiqueAchats.negociationPrix} onChange={e => handleFieldChange('politiqueAchats', 'negociationPrix', e.target.value)} readOnly={isReadOnly}/></FormCell>
                        <FormCell colSpan={6} rowSpan={2} isLabel className="bg-gray-100">Gestion des aléas: rupture, transport, variation des prix</FormCell>
                        <FormCell colSpan={6} rowSpan={2}><TextAreaField rows={4} name="gestionAleas" value={activiteMarche.politiqueAchats.gestionAleas} onChange={e => handleFieldChange('politiqueAchats', 'gestionAleas', e.target.value)} readOnly={isReadOnly}/></FormCell>
                    </div>
                </div>
            </div>

            {/* Synthese */}
            <div className="grid grid-cols-24 gap-0 mt-2 border-t-2 border-gray-400">
                <FormCell colSpan={24} isHeader>Synthèse : Opinion de l'Agence : description générale, nature des activités, volumes et marges, risques, avantages concurrentiels, maîtrise des processus, ...</FormCell>
                <FormCell colSpan={24}><TextAreaField rows={4} name="synthese" value={activiteMarche.synthese} onChange={e => handleSyntheseChange(e.target.value)} readOnly={isReadOnly} /></FormCell>
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

export default ActiviteMarchePage;