
import React from 'react';
import { CreditApplicationData, EntrepriseData, EvolutionCapital, Dirigeant, AutreAffaireEntreprise, MoyenEconomique, MoyenHumainPersonnel, OrganisationManagement } from '../types.ts';
import { formeJuridiqueOptions, biensUtilisesOptions } from '../constants.ts';

interface EntreprisePageProps {
  formData: CreditApplicationData;
  setFormData: React.Dispatch<React.SetStateAction<CreditApplicationData>>;
  onNext: () => void;
  isReadOnly?: boolean;
}

const FormCell = ({ children, className = '', colSpan = 1, rowSpan = 1, isHeader = false, isSubHeader = false, isTitle = false, isLabel = false }: { children: any, className?: string, colSpan?: number, rowSpan?: number, isHeader?: boolean, isSubHeader?: boolean, isTitle?: boolean, isLabel?: boolean }) => {
    const baseClasses = 'border border-gray-400 p-1 text-xs flex items-center';
    const bgClasses = isTitle ? 'bg-gray-300 font-bold' : isHeader ? 'bg-gray-200 font-semibold' : isSubHeader ? 'bg-gray-100 font-semibold' : 'bg-white';
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

const SelectField = ({ value, onChange, name, options, className = '', readOnly = false }) => (
    <select name={name} value={value} onChange={onChange} disabled={readOnly} className={`w-full h-full bg-transparent outline-none text-xs ${readOnly ? 'bg-gray-100 cursor-not-allowed' : ''} ${className}`}>
        {options.map((opt, i) => <option key={i} value={opt}>{opt}</option>)}
    </select>
);

const TextAreaField = ({ value, onChange, name, className = '', rows = 2, readOnly = false, placeholder='' }) => (
    <textarea name={name} value={value ?? ''} onChange={onChange} rows={rows} readOnly={readOnly} placeholder={placeholder} className={`w-full h-full bg-transparent outline-none text-xs p-1 ${readOnly ? 'bg-gray-100 cursor-not-allowed' : ''} ${className}`} />
);

const ActionButton = ({ onClick, children, className = '' }) => (
    <button type="button" onClick={onClick} className={`text-xs px-2 py-1 rounded ${className}`}>
        {children}
    </button>
);


const EntreprisePage: React.FC<EntreprisePageProps> = ({ formData, setFormData, onNext, isReadOnly = false }) => {

    const { entreprise } = formData;
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        if (isReadOnly) return;
        const { name, value } = e.target;
        const fieldType = e.target.getAttribute('type');
        const finalValue = fieldType === 'number' ? parseFloat(value) || 0 : value;

        setFormData(prev => ({
            ...prev,
            entreprise: {
                ...prev.entreprise,
                [name]: finalValue
            }
        }));
    };
    
    const handleNestedChange = <T,>(section: keyof EntrepriseData, index: number, field: keyof T, value: any) => {
        if (isReadOnly) return;
        setFormData(prev => {
            const newSectionData = [...(prev.entreprise[section] as any[])];
            const currentItem = newSectionData[index];
            const fieldType = typeof currentItem[field];
            const finalValue = fieldType === 'number' ? parseFloat(value) || 0 : value;

            newSectionData[index] = { ...currentItem, [field]: finalValue };

            return { ...prev, entreprise: { ...prev.entreprise, [section]: newSectionData } };
        });
    };

    const addRow = <T extends { id: string }>(section: keyof EntrepriseData, newRowData: Omit<T, 'id'>) => {
        if (isReadOnly) return;
        const newRow = { ...newRowData, id: Date.now().toString() } as T;
        setFormData(prev => ({
            ...prev,
            entreprise: {
                ...prev.entreprise,
                [section]: [...(prev.entreprise[section] as any[]), newRow]
            }
        }));
    };

    const removeRow = (section: keyof EntrepriseData, index: number) => {
        if (isReadOnly) return;
        setFormData(prev => ({
            ...prev,
            entreprise: {
                ...prev.entreprise,
                [section]: (prev.entreprise[section] as any[]).filter((_, i) => i !== index)
            }
        }));
    };

    const newEvolutionCapitalTemplate: Omit<EvolutionCapital, 'id'> = { date: '', capital: 0, formeJuridique: '', entrepreneur1: '', k1: 0, entrepreneur2: '', k2: 0, entrepreneur3: '', k3: 0 };
    const newDirigeantTemplate: Omit<Dirigeant, 'id'> = { nomPrenom: '', fonction: '', formationExperience: '', telephone: '' };
    const newAutreAffaireEntrepriseTemplate: Omit<AutreAffaireEntreprise, 'id'> = { denomination: '', capital: 0, k: 0, activite: '', caht: 0, banque: '' };
    const newMoyenEconomiqueTemplate: Omit<MoyenEconomique, 'id'> = { bienUtilise: 'Terrain', quantiteConsistance: '', valeurCptle: 0, valeurEstimee: 0 };
    
    const handleOrgMgtChange = (field: keyof OrganisationManagement, value: string) => {
         if (isReadOnly) return;
         setFormData(prev => ({
            ...prev,
            entreprise: {
                ...prev.entreprise,
                organisationManagement: {
                    ...prev.entreprise.organisationManagement,
                    [field]: value
                }
            }
        }));
    };
    
    const handleMoyensHumainsChange = (category: keyof Omit<EntrepriseData['moyensHumains'], 'total'>, field: keyof Omit<MoyenHumainPersonnel, 'total'>, value: number) => {
         if (isReadOnly) return;
         setFormData(prev => {
            const newCategoryData = {
                ...prev.entreprise.moyensHumains[category],
                [field]: value
            };
            
            return {
                ...prev,
                entreprise: {
                    ...prev.entreprise,
                    moyensHumains: {
                        ...prev.entreprise.moyensHumains,
                        [category]: newCategoryData
                    }
                }
            }
        });
    };

    const handleMoyensHumainsTotalChange = (field: keyof EntrepriseData['moyensHumains']['total'], value: any) => {
         if (isReadOnly) return;
         setFormData(prev => ({
            ...prev,
            entreprise: {
                ...prev.entreprise,
                moyensHumains: {
                    ...prev.entreprise.moyensHumains,
                    total: {
                        ...prev.entreprise.moyensHumains.total,
                        [field]: value
                    }
                }
            }
        }));
    }

    // Dynamic calculations for rendering
    const totalMoyensEcoCptle = entreprise.moyensEconomiques.reduce((sum, item) => sum + Number(item.valeurCptle), 0);
    const totalMoyensEcoEstimee = entreprise.moyensEconomiques.reduce((sum, item) => sum + Number(item.valeurEstimee), 0);

    const calcMoyensHumainsTotal = (category: MoyenHumainPersonnel) => Number(category.cadre) + Number(category.maitrise) + Number(category.ouvrier);
    const totalAdmin = calcMoyensHumainsTotal(entreprise.moyensHumains.administratif);
    const totalProd = calcMoyensHumainsTotal(entreprise.moyensHumains.production);
    const totalComm = calcMoyensHumainsTotal(entreprise.moyensHumains.commercial);

    return (
        <div className="bg-white p-4 rounded-lg text-sm">
            {/* Header */}
            <div className="grid grid-cols-24 gap-0 mb-2">
                <FormCell colSpan={2} isHeader>Affaire</FormCell>
                <FormCell colSpan={6} isSubHeader>{formData.affaire}</FormCell>
                <FormCell colSpan={8} isHeader className="text-center font-bold text-base">Entreprise</FormCell>
                <FormCell colSpan={8} isHeader className="text-right font-bold">Dossier {formData.dossier}</FormCell>
                <FormCell colSpan={2} isHeader>Date ouverture du dossier</FormCell>
                <FormCell colSpan={6}><InputField type="date" name="dateOuvertureDossier" value={formData.dateOuvertureDossier} onChange={e => setFormData({...formData, dateOuvertureDossier: e.target.value})} readOnly={isReadOnly} /></FormCell>
            </div>
            
            {/* Identification */}
            <div className="grid grid-cols-24 gap-0 mb-2 border-t-4 border-gray-500">
                <FormCell colSpan={24} isTitle>Identification de l'entreprise</FormCell>
                
                <FormCell colSpan={3} isHeader>Dénomination sociale</FormCell>
                <FormCell colSpan={9}><InputField name="denominationSociale" value={entreprise.denominationSociale} onChange={handleChange} readOnly={isReadOnly}/></FormCell>
                <FormCell colSpan={3} isHeader>Date de création</FormCell>
                <FormCell colSpan={3}><InputField name="dateCreation" type="date" value={entreprise.dateCreation} onChange={handleChange} readOnly={isReadOnly}/></FormCell>
                <FormCell colSpan={3} isHeader>Date début activité</FormCell>
                <FormCell colSpan={3}><InputField name="dateDebutActivite" type="date" value={entreprise.dateDebutActivite} onChange={handleChange} readOnly={isReadOnly}/></FormCell>

                <FormCell colSpan={3} isHeader>Secteur d'activité</FormCell>
                <FormCell colSpan={9}><InputField name="secteurActivite" value={entreprise.secteurActivite} onChange={handleChange} readOnly={isReadOnly}/></FormCell>
                <FormCell colSpan={3} isHeader>Forme juridique</FormCell>
                <FormCell colSpan={9}><SelectField name="formeJuridique" value={entreprise.formeJuridique} onChange={handleChange} options={formeJuridiqueOptions} readOnly={isReadOnly}/></FormCell>
                
                <FormCell colSpan={3} isHeader>Siège social</FormCell>
                <FormCell colSpan={5}><InputField name="siegeSocial" value={entreprise.siegeSocial} onChange={handleChange} readOnly={isReadOnly}/></FormCell>
                <FormCell colSpan={1} isHeader>Ville</FormCell>
                <FormCell colSpan={3}><InputField name="ville" value={entreprise.ville} onChange={handleChange} readOnly={isReadOnly}/></FormCell>
                <FormCell colSpan={3} isHeader>Capital social</FormCell>
                <FormCell colSpan={3}><InputField name="capitalSocial" type="number" value={String(entreprise.capitalSocial)} onChange={handleChange} readOnly={isReadOnly}/></FormCell>
                <FormCell colSpan={3} isHeader className="text-red-600">KFCFA</FormCell>
                <FormCell colSpan={3}>{''}</FormCell>

                <FormCell colSpan={3} isHeader>Locaux d'exploitation</FormCell>
                <FormCell colSpan={9}><InputField name="locauxExploitation" value={entreprise.locauxExploitation} onChange={handleChange} readOnly={isReadOnly}/></FormCell>
                <FormCell colSpan={3} isHeader>N° patente</FormCell>
                <FormCell colSpan={9}><InputField name="nPatente" value={entreprise.nPatente} onChange={handleChange} readOnly={isReadOnly}/></FormCell>

                <FormCell colSpan={3} isHeader>Email, Site</FormCell>
                <FormCell colSpan={5}><InputField name="emailSite" value={entreprise.emailSite} onChange={handleChange} readOnly={isReadOnly}/></FormCell>
                <FormCell colSpan={1} isHeader>Téléphone</FormCell>
                <FormCell colSpan={3}><InputField name="telephone" value={entreprise.telephone} onChange={handleChange} readOnly={isReadOnly}/></FormCell>
                 <FormCell colSpan={3} isHeader>N°Registre du commerce</FormCell>
                <FormCell colSpan={9}><InputField name="nRegistreCommerce" value={entreprise.nRegistreCommerce} onChange={handleChange} readOnly={isReadOnly}/></FormCell>

                <FormCell colSpan={12}>{''}</FormCell>
                <FormCell colSpan={3} isHeader>N° IFU</FormCell>
                <FormCell colSpan={9}><InputField name="nifu" value={entreprise.nifu} onChange={handleChange} readOnly={isReadOnly}/></FormCell>
                
                <FormCell colSpan={12}>{''}</FormCell>
                <FormCell colSpan={3} isHeader>N° Affiliation CNSS</FormCell>
                <FormCell colSpan={9}><InputField name="nAffiliationCNSS" value={entreprise.nAffiliationCNSS} onChange={handleChange} readOnly={isReadOnly}/></FormCell>
            </div>
            
            {/* Evolution Capital */}
            <div className="grid grid-cols-24 gap-0 mb-2 border-t-4 border-gray-500">
                <FormCell colSpan={24} isTitle>Evolution de la répartition du capital</FormCell>
                <FormCell colSpan={3} isHeader>Date</FormCell>
                <FormCell colSpan={3} isHeader>Capital (en KFCFA)</FormCell>
                <FormCell colSpan={3} isHeader>Forme juridique</FormCell>
                <FormCell colSpan={3} isHeader>Entrepreneur</FormCell>
                <FormCell colSpan={1} isHeader>% K</FormCell>
                <FormCell colSpan={3} isHeader>Entrepreneur</FormCell>
                <FormCell colSpan={1} isHeader>% K</FormCell>
                <FormCell colSpan={3} isHeader>Entrepreneur</FormCell>
                <FormCell colSpan={1} isHeader>% K</FormCell>
                <FormCell colSpan={3} isHeader>Action</FormCell>
                {entreprise.evolutionCapital.map((item, index) => (
                    <React.Fragment key={item.id}>
                        <FormCell colSpan={3}><InputField type="date" name="date" value={item.date} onChange={e => handleNestedChange<EvolutionCapital>('evolutionCapital', index, 'date', e.target.value)} readOnly={isReadOnly}/></FormCell>
                        <FormCell colSpan={3}><InputField type="number" name="capital" value={String(item.capital)} onChange={e => handleNestedChange<EvolutionCapital>('evolutionCapital', index, 'capital', e.target.value)} readOnly={isReadOnly}/></FormCell>
                        <FormCell colSpan={3}><InputField name="formeJuridique" value={item.formeJuridique} onChange={e => handleNestedChange<EvolutionCapital>('evolutionCapital', index, 'formeJuridique', e.target.value)} readOnly={isReadOnly}/></FormCell>
                        <FormCell colSpan={3}><InputField name="entrepreneur1" value={item.entrepreneur1} onChange={e => handleNestedChange<EvolutionCapital>('evolutionCapital', index, 'entrepreneur1', e.target.value)} readOnly={isReadOnly}/></FormCell>
                        <FormCell colSpan={1}><InputField type="number" name="k1" value={String(item.k1)} onChange={e => handleNestedChange<EvolutionCapital>('evolutionCapital', index, 'k1', e.target.value)} readOnly={isReadOnly}/></FormCell>
                        <FormCell colSpan={3}><InputField name="entrepreneur2" value={item.entrepreneur2} onChange={e => handleNestedChange<EvolutionCapital>('evolutionCapital', index, 'entrepreneur2', e.target.value)} readOnly={isReadOnly}/></FormCell>
                        <FormCell colSpan={1}><InputField type="number" name="k2" value={String(item.k2)} onChange={e => handleNestedChange<EvolutionCapital>('evolutionCapital', index, 'k2', e.target.value)} readOnly={isReadOnly}/></FormCell>
                        <FormCell colSpan={3}><InputField name="entrepreneur3" value={item.entrepreneur3} onChange={e => handleNestedChange<EvolutionCapital>('evolutionCapital', index, 'entrepreneur3', e.target.value)} readOnly={isReadOnly}/></FormCell>
                        <FormCell colSpan={1}><InputField type="number" name="k3" value={String(item.k3)} onChange={e => handleNestedChange<EvolutionCapital>('evolutionCapital', index, 'k3', e.target.value)} readOnly={isReadOnly}/></FormCell>
                        <FormCell colSpan={3}>{!isReadOnly && <ActionButton onClick={() => removeRow('evolutionCapital', index)} className="text-red-500 hover:bg-red-100 w-full">[-]</ActionButton>}</FormCell>
                    </React.Fragment>
                ))}
                {!isReadOnly && <FormCell colSpan={24}>
                    <ActionButton onClick={() => addRow<EvolutionCapital>('evolutionCapital', newEvolutionCapitalTemplate)} className="text-green-600 hover:bg-green-100 w-full">
                        [+] Ajouter une ligne
                    </ActionButton>
                </FormCell>}
            </div>
            
            {/* Dirigeants */}
            <div className="grid grid-cols-24 gap-0 mb-2 border-t-4 border-gray-500">
                <FormCell colSpan={24} isTitle>Dirigeants de l'entreprise</FormCell>
                <FormCell colSpan={6} isHeader>Nom et prénom</FormCell>
                <FormCell colSpan={6} isHeader>Fonction</FormCell>
                <FormCell colSpan={7} isHeader>Formation et expérience</FormCell>
                <FormCell colSpan={4} isHeader>Téléphone</FormCell>
                <FormCell colSpan={1} isHeader>Act.</FormCell>
                 {entreprise.dirigeants.map((item, index) => (
                    <React.Fragment key={item.id}>
                        <FormCell colSpan={6}><InputField name="nomPrenom" value={item.nomPrenom} onChange={e => handleNestedChange<Dirigeant>('dirigeants', index, 'nomPrenom', e.target.value)} readOnly={isReadOnly}/></FormCell>
                        <FormCell colSpan={6}><InputField name="fonction" value={item.fonction} onChange={e => handleNestedChange<Dirigeant>('dirigeants', index, 'fonction', e.target.value)} readOnly={isReadOnly}/></FormCell>
                        <FormCell colSpan={7}><InputField name="formationExperience" value={item.formationExperience} onChange={e => handleNestedChange<Dirigeant>('dirigeants', index, 'formationExperience', e.target.value)} readOnly={isReadOnly}/></FormCell>
                        <FormCell colSpan={4}><InputField name="telephone" value={item.telephone} onChange={e => handleNestedChange<Dirigeant>('dirigeants', index, 'telephone', e.target.value)} readOnly={isReadOnly}/></FormCell>
                        <FormCell colSpan={1}>{!isReadOnly && <ActionButton onClick={() => removeRow('dirigeants', index)} className="text-red-500 hover:bg-red-100 w-full">[-]</ActionButton>}</FormCell>
                    </React.Fragment>
                ))}
                 {!isReadOnly && <FormCell colSpan={24}>
                    <ActionButton onClick={() => addRow<Dirigeant>('dirigeants', newDirigeantTemplate)} className="text-green-600 hover:bg-green-100 w-full">
                        [+] Ajouter une ligne
                    </ActionButton>
                </FormCell>}
            </div>

            {/* Autres affaires */}
            <div className="grid grid-cols-24 gap-0 mb-2 border-t-4 border-gray-500">
                <FormCell colSpan={24} isTitle>Autres affaires détenues par l'entreprise</FormCell>
                <FormCell colSpan={5} isHeader>Dénomination</FormCell>
                <FormCell colSpan={3} isHeader>Capital (en KFCFA)</FormCell>
                <FormCell colSpan={1} isHeader>% K</FormCell>
                <FormCell colSpan={6} isHeader>Activité</FormCell>
                <FormCell colSpan={4} isHeader>CAHT (KFCFA)</FormCell>
                <FormCell colSpan={4} isHeader>Banque</FormCell>
                <FormCell colSpan={1} isHeader>Act.</FormCell>
                {entreprise.autresAffaires.map((item, index) => (
                    <React.Fragment key={item.id}>
                         <FormCell colSpan={5}><InputField name="denomination" value={item.denomination} onChange={e => handleNestedChange<AutreAffaireEntreprise>('autresAffaires', index, 'denomination', e.target.value)} readOnly={isReadOnly}/></FormCell>
                         <FormCell colSpan={3}><InputField type="number" name="capital" value={String(item.capital)} onChange={e => handleNestedChange<AutreAffaireEntreprise>('autresAffaires', index, 'capital', e.target.value)} readOnly={isReadOnly}/></FormCell>
                         <FormCell colSpan={1}><InputField type="number" name="k" value={String(item.k)} onChange={e => handleNestedChange<AutreAffaireEntreprise>('autresAffaires', index, 'k', e.target.value)} readOnly={isReadOnly}/></FormCell>
                         <FormCell colSpan={6}><InputField name="activite" value={item.activite} onChange={e => handleNestedChange<AutreAffaireEntreprise>('autresAffaires', index, 'activite', e.target.value)} readOnly={isReadOnly}/></FormCell>
                         <FormCell colSpan={4}><InputField type="number" name="caht" value={String(item.caht)} onChange={e => handleNestedChange<AutreAffaireEntreprise>('autresAffaires', index, 'caht', e.target.value)} readOnly={isReadOnly}/></FormCell>
                         <FormCell colSpan={4}><InputField name="banque" value={item.banque} onChange={e => handleNestedChange<AutreAffaireEntreprise>('autresAffaires', index, 'banque', e.target.value)} readOnly={isReadOnly}/></FormCell>
                         <FormCell colSpan={1}>{!isReadOnly && <ActionButton onClick={() => removeRow('autresAffaires', index)} className="text-red-500 hover:bg-red-100 w-full">[-]</ActionButton>}</FormCell>
                    </React.Fragment>
                ))}
                 {!isReadOnly && <FormCell colSpan={24}>
                    <ActionButton onClick={() => addRow<AutreAffaireEntreprise>('autresAffaires', newAutreAffaireEntrepriseTemplate)} className="text-green-600 hover:bg-green-100 w-full">
                        [+] Ajouter une ligne
                    </ActionButton>
                </FormCell>}
            </div>

            {/* Moyens */}
            <div className="grid grid-cols-24 gap-0 mb-2 border-t-4 border-gray-500">
                 <div style={{gridColumn: 'span 12'}} className="border-r border-gray-400">
                    <div className="grid grid-cols-12 gap-0">
                        <FormCell colSpan={12} isTitle>Moyens économiques</FormCell>
                        <FormCell colSpan={4} isHeader>Biens utilisés</FormCell>
                        <FormCell colSpan={3} isHeader>Quantité/consistance</FormCell>
                        <FormCell colSpan={4} isHeader>Valeur en KFCFA</FormCell>
                        <FormCell colSpan={1} isHeader>Act.</FormCell>
                        
                        <FormCell colSpan={4} rowSpan={1}>{''}</FormCell>
                        <FormCell colSpan={3} rowSpan={1}>{''}</FormCell>
                        <FormCell colSpan={2} isSubHeader>Cptle</FormCell>
                        <FormCell colSpan={2} isSubHeader>Estimée</FormCell>
                        <FormCell colSpan={1} rowSpan={1}>{''}</FormCell>

                        {entreprise.moyensEconomiques.map((item, index) => (
                            <React.Fragment key={item.id}>
                                <FormCell colSpan={4}><SelectField name="bienUtilise" value={item.bienUtilise} onChange={e => handleNestedChange<MoyenEconomique>('moyensEconomiques', index, 'bienUtilise', e.target.value)} options={biensUtilisesOptions} readOnly={isReadOnly}/></FormCell>
                                <FormCell colSpan={3}><InputField name="quantiteConsistance" value={item.quantiteConsistance} onChange={e => handleNestedChange<MoyenEconomique>('moyensEconomiques', index, 'quantiteConsistance', e.target.value)} readOnly={isReadOnly}/></FormCell>
                                <FormCell colSpan={2}><InputField type="number" name="valeurCptle" value={String(item.valeurCptle)} onChange={e => handleNestedChange<MoyenEconomique>('moyensEconomiques', index, 'valeurCptle', e.target.value)} readOnly={isReadOnly}/></FormCell>
                                <FormCell colSpan={2}><InputField type="number" name="valeurEstimee" value={String(item.valeurEstimee)} onChange={e => handleNestedChange<MoyenEconomique>('moyensEconomiques', index, 'valeurEstimee', e.target.value)} readOnly={isReadOnly}/></FormCell>
                                <FormCell colSpan={1}>{!isReadOnly && <ActionButton onClick={() => removeRow('moyensEconomiques', index)} className="text-red-500 hover:bg-red-100 w-full">[-]</ActionButton>}</FormCell>
                            </React.Fragment>
                        ))}
                         {!isReadOnly && <FormCell colSpan={12}>
                            <ActionButton onClick={() => addRow<MoyenEconomique>('moyensEconomiques', newMoyenEconomiqueTemplate)} className="text-green-600 hover:bg-green-100 w-full">[+]</ActionButton>
                        </FormCell>}
                        <FormCell colSpan={7} isHeader>TOTAL</FormCell>
                        <FormCell colSpan={2} isHeader>{totalMoyensEcoCptle}</FormCell>
                        <FormCell colSpan={2} isHeader>{totalMoyensEcoEstimee}</FormCell>
                        <FormCell colSpan={1}>{''}</FormCell>
                    </div>
                 </div>
                 <div style={{gridColumn: 'span 12'}}>
                    <div className="grid grid-cols-12 gap-0">
                        <FormCell colSpan={12} isTitle>Moyens humains</FormCell>
                        <FormCell colSpan={6} isHeader>Personnel</FormCell>
                        <FormCell colSpan={1} isHeader>Nb.</FormCell>
                        <FormCell colSpan={1} isHeader>Cadre</FormCell>
                        <FormCell colSpan={1} isHeader>Maîtrise</FormCell>
                        <FormCell colSpan={1} isHeader>Ouvrier</FormCell>
                        <FormCell colSpan={2} isHeader>TOTAL</FormCell>
                        
                        <FormCell colSpan={6} isLabel isSubHeader>Administratif</FormCell>
                        <FormCell colSpan={1}><InputField type="number" value={String(entreprise.moyensHumains.administratif.nb)} onChange={e => handleMoyensHumainsChange('administratif', 'nb', parseInt(e.target.value, 10) || 0)} readOnly={isReadOnly}/></FormCell>
                        <FormCell colSpan={1}><InputField type="number" value={String(entreprise.moyensHumains.administratif.cadre)} onChange={e => handleMoyensHumainsChange('administratif', 'cadre', parseInt(e.target.value, 10) || 0)} readOnly={isReadOnly}/></FormCell>
                        <FormCell colSpan={1}><InputField type="number" value={String(entreprise.moyensHumains.administratif.maitrise)} onChange={e => handleMoyensHumainsChange('administratif', 'maitrise', parseInt(e.target.value, 10) || 0)} readOnly={isReadOnly}/></FormCell>
                        <FormCell colSpan={1}><InputField type="number" value={String(entreprise.moyensHumains.administratif.ouvrier)} onChange={e => handleMoyensHumainsChange('administratif', 'ouvrier', parseInt(e.target.value, 10) || 0)} readOnly={isReadOnly}/></FormCell>
                        <FormCell colSpan={2}>{totalAdmin}</FormCell>
                        
                        <FormCell colSpan={6} isLabel isSubHeader>Production</FormCell>
                        <FormCell colSpan={1}><InputField type="number" value={String(entreprise.moyensHumains.production.nb)} onChange={e => handleMoyensHumainsChange('production', 'nb', parseInt(e.target.value, 10) || 0)} readOnly={isReadOnly}/></FormCell>
                        <FormCell colSpan={1}><InputField type="number" value={String(entreprise.moyensHumains.production.cadre)} onChange={e => handleMoyensHumainsChange('production', 'cadre', parseInt(e.target.value, 10) || 0)} readOnly={isReadOnly}/></FormCell>
                        <FormCell colSpan={1}><InputField type="number" value={String(entreprise.moyensHumains.production.maitrise)} onChange={e => handleMoyensHumainsChange('production', 'maitrise', parseInt(e.target.value, 10) || 0)} readOnly={isReadOnly}/></FormCell>
                        <FormCell colSpan={1}><InputField type="number" value={String(entreprise.moyensHumains.production.ouvrier)} onChange={e => handleMoyensHumainsChange('production', 'ouvrier', parseInt(e.target.value, 10) || 0)} readOnly={isReadOnly}/></FormCell>
                        <FormCell colSpan={2}>{totalProd}</FormCell>
                        
                        <FormCell colSpan={6} isLabel isSubHeader>Commercial</FormCell>
                        <FormCell colSpan={1}><InputField type="number" value={String(entreprise.moyensHumains.commercial.nb)} onChange={e => handleMoyensHumainsChange('commercial', 'nb', parseInt(e.target.value, 10) || 0)} readOnly={isReadOnly}/></FormCell>
                        <FormCell colSpan={1}><InputField type="number" value={String(entreprise.moyensHumains.commercial.cadre)} onChange={e => handleMoyensHumainsChange('commercial', 'cadre', parseInt(e.target.value, 10) || 0)} readOnly={isReadOnly}/></FormCell>
                        <FormCell colSpan={1}><InputField type="number" value={String(entreprise.moyensHumains.commercial.maitrise)} onChange={e => handleMoyensHumainsChange('commercial', 'maitrise', parseInt(e.target.value, 10) || 0)} readOnly={isReadOnly}/></FormCell>
                        <FormCell colSpan={1}><InputField type="number" value={String(entreprise.moyensHumains.commercial.ouvrier)} onChange={e => handleMoyensHumainsChange('commercial', 'ouvrier', parseInt(e.target.value, 10) || 0)} readOnly={isReadOnly}/></FormCell>
                        <FormCell colSpan={2}>{totalComm}</FormCell>
                        
                        <FormCell colSpan={6} isHeader>Masse salariale 12 mois (KFCFA)</FormCell>
                        <FormCell colSpan={6}><InputField type="number" value={String(entreprise.moyensHumains.total.masseSalariale12Mois)} onChange={e => handleMoyensHumainsTotalChange('masseSalariale12Mois', parseInt(e.target.value, 10) || 0)} readOnly={isReadOnly}/></FormCell>
                        <FormCell colSpan={6} isHeader>Cotisation CNSS 12 mois (KFCFA)</FormCell>
                        <FormCell colSpan={6}><InputField type="number" value={String(entreprise.moyensHumains.total.cotisationCNSS12Mois)} onChange={e => handleMoyensHumainsTotalChange('cotisationCNSS12Mois', parseInt(e.target.value, 10) || 0)} readOnly={isReadOnly}/></FormCell>
                        <FormCell colSpan={6} isHeader>Nbre de salariés déclarés</FormCell>
                        <FormCell colSpan={6}><InputField type="number" value={String(entreprise.moyensHumains.total.nbreSalariesDeclares)} onChange={e => handleMoyensHumainsTotalChange('nbreSalariesDeclares', parseInt(e.target.value, 10) || 0)} readOnly={isReadOnly}/></FormCell>
                        <FormCell colSpan={6} isHeader>Dt nbre de salariés clients</FormCell>
                        <FormCell colSpan={6}><InputField type="number" value={String(entreprise.moyensHumains.total.dtNbSalariesClients)} onChange={e => handleMoyensHumainsTotalChange('dtNbSalariesClients', parseInt(e.target.value, 10) || 0)} readOnly={isReadOnly}/></FormCell>
                        <FormCell colSpan={6} isHeader>Prévision création emploi</FormCell>
                        <FormCell colSpan={6}><InputField value={entreprise.moyensHumains.total.previsionCreationEmploi} onChange={e => handleMoyensHumainsTotalChange('previsionCreationEmploi', e.target.value)} readOnly={isReadOnly}/></FormCell>
                    </div>
                 </div>
            </div>

             {/* Organisation */}
             <div className="grid grid-cols-24 gap-0 mb-2 border-t-4 border-gray-500">
                <FormCell colSpan={24} isTitle>Organisation et Management</FormCell>
                <FormCell colSpan={6} isHeader>Préparation de la relève</FormCell>
                <FormCell colSpan={18}><TextAreaField rows={1} name="preparationReleve" value={entreprise.organisationManagement.preparationReleve} onChange={e => handleOrgMgtChange('preparationReleve', e.target.value)} readOnly={isReadOnly}/></FormCell>
                <FormCell colSpan={6} isHeader>Organisation des services</FormCell>
                <FormCell colSpan={18}><TextAreaField rows={1} name="organisationServices" value={entreprise.organisationManagement.organisationServices} onChange={e => handleOrgMgtChange('organisationServices', e.target.value)} readOnly={isReadOnly}/></FormCell>
                <FormCell colSpan={6} isHeader>Comptabilité</FormCell>
                <FormCell colSpan={18}><TextAreaField rows={1} name="comptabilite" value={entreprise.organisationManagement.comptabilite} onChange={e => handleOrgMgtChange('comptabilite', e.target.value)} readOnly={isReadOnly}/></FormCell>
                <FormCell colSpan={6} isHeader>Gestion des RH</FormCell>
                <FormCell colSpan={18}><TextAreaField rows={1} name="gestionRH" value={entreprise.organisationManagement.gestionRH} onChange={e => handleOrgMgtChange('gestionRH', e.target.value)} readOnly={isReadOnly}/></FormCell>
                <FormCell colSpan={6} isHeader>Utilisation de l'informatique</FormCell>
                <FormCell colSpan={18}><TextAreaField rows={1} name="utilisationInformatique" value={entreprise.organisationManagement.utilisationInformatique} onChange={e => handleOrgMgtChange('utilisationInformatique', e.target.value)} readOnly={isReadOnly}/></FormCell>
             </div>
             
             {/* Synthese */}
            <div className="grid grid-cols-24 gap-0 mb-4 border-t-4 border-gray-500">
                <FormCell colSpan={24} isTitle>Synthèse : opinion de l'Agence sur l'entreprise : présentation résumée, points forts et points faibles, risques potentiels</FormCell>
                <FormCell colSpan={24}><TextAreaField rows={4} name="syntheseEntreprise" value={entreprise.syntheseEntreprise} onChange={e => setFormData(prev => ({...prev, entreprise: {...prev.entreprise, syntheseEntreprise: e.target.value}}))} readOnly={isReadOnly}/></FormCell>
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

export default EntreprisePage;