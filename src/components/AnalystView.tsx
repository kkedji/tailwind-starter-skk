

import React, { useState } from 'react';
import { CreditApplicationData, DossierStatus } from '../types.ts';
import CreditApplicationPage from './CreditApplicationPage.tsx';
import SynthesePage from './SynthesePage.tsx';
import GarantiesPage from './GarantiesPage.tsx';
import EntrepreneursPage from './EntrepreneursPage.tsx';
import EntreprisePage from './EntreprisePage.tsx';
import ActiviteMarchePage from './ActiviteMarchePage.tsx';
import CompteDeResultatPage from './CompteDeResultatPage.tsx';
import BilanPage from './BilanPage.tsx';
import HistoriquePage from './HistoriquePage.tsx';
import TresoreriePage from './TresoreriePage.tsx';
import RatiosPage from './RatiosPage.tsx';
import EcheancierPage from './EcheancierPage.tsx';
import CalculsOptionnelsPage from './CalculsOptionnelsPage.tsx';
import AnalyseEntrepreneurPage from './analyse/AnalyseEntrepreneurPage.tsx';
import AnalyseEntreprisePage from './analyse/AnalyseEntreprisePage.tsx';
import AnalyseActivitePage from './analyse/AnalyseActivitePage.tsx';
import AnalyseCashFlowPage from './analyse/AnalyseCashFlowPage.tsx';
import AnalyseHistoriquePage from './analyse/AnalyseHistoriquePage.tsx';
import PonderationPage from './analyse/PonderationPage.tsx';


interface AnalystViewProps {
  dossier: CreditApplicationData;
  setDossierData: (updateFn: (prev: CreditApplicationData) => CreditApplicationData) => void;
  updateDossierStatus: (dossierId: string, newStatus: DossierStatus, action: string) => void;
  onBack: () => void;
}

type MainTab = 'CONSULTATION' | 'ANALYSE';
type ConsultationTab = 'garde' | 'synthese' | 'garanties' | 'entrepreneurs' | 'entreprise' | 'activite' | 'compteDeResultat' | 'bilan' | 'historique' | 'tresorerie' | 'ratios' | 'echeancier' | 'calculs';
type AnalysisTab = 'entrepreneur' | 'entreprise' | 'activite' | 'historique' | 'cashFlow' | 'ponderation';

const CONSULTATION_TABS_ORDER: ConsultationTab[] = ['garde', 'synthese', 'garanties', 'entrepreneurs', 'entreprise', 'activite', 'compteDeResultat', 'bilan', 'historique', 'tresorerie', 'ratios', 'echeancier', 'calculs'];
const ANALYSIS_TABS_ORDER: AnalysisTab[] = ['entrepreneur', 'entreprise', 'activite', 'cashFlow', 'historique', 'ponderation'];
const ANALYSIS_TABS_LABELS: Record<AnalysisTab, string> = {
    entrepreneur: 'Risque Entrepreneur',
    entreprise: 'Risque Entreprise',
    activite: 'Risque Activité',
    cashFlow: 'Risque Trésorerie',
    historique: 'Risque Historique',
    ponderation: 'Pondération & Décision',
};

const AnalystView: React.FC<AnalystViewProps> = ({ dossier, setDossierData, updateDossierStatus, onBack }) => {
    const [mainTab, setMainTab] = useState<MainTab>('ANALYSE');
    const [consultationTab, setConsultationTab] = useState<ConsultationTab>('garde');
    const [analysisTab, setAnalysisTab] = useState<AnalysisTab>('entrepreneur');

    const handleSendBack = () => {
        if (window.confirm("Êtes-vous sûr de vouloir renvoyer ce dossier au collecteur pour modification ?")) {
            updateDossierStatus(dossier.id, 'RETOUR_COLLECTE', 'Renvoyé au collecteur pour modification');
            onBack();
        }
    };
    
    const handleNextAnalysis = () => {
        const currentIndex = ANALYSIS_TABS_ORDER.indexOf(analysisTab);
        if (currentIndex < ANALYSIS_TABS_ORDER.length - 1) {
            setAnalysisTab(ANALYSIS_TABS_ORDER[currentIndex + 1]);
        }
    };

    const renderConsultationView = () => (
        <>
            <nav className="flex border-b border-gray-300 hide-on-print overflow-x-auto">
                 {CONSULTATION_TABS_ORDER.map(tab => (
                    <button
                        key={tab}
                        onClick={() => setConsultationTab(tab)}
                        className={`px-3 py-2 text-xs font-medium rounded-t-lg transition-colors ${consultationTab === tab ? 'bg-white text-blue-600 border-b-2 border-blue-600' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
                    >
                         {tab.charAt(0).toUpperCase() + tab.slice(1).replace(/([A-Z])/g, ' $1').trim()}
                    </button>
                ))}
            </nav>
            <div className="mt-1 bg-white shadow-lg rounded-b-lg">
                {consultationTab === 'garde' && <CreditApplicationPage formData={dossier} setFormData={setDossierData} onNext={() => {}} isReadOnly />}
                {consultationTab === 'synthese' && <SynthesePage formData={dossier} setFormData={setDossierData} onNext={() => {}} isReadOnly />}
                {consultationTab === 'garanties' && <GarantiesPage formData={dossier} setFormData={setDossierData} onNext={() => {}} isReadOnly />}
                {consultationTab === 'entrepreneurs' && <EntrepreneursPage formData={dossier} setFormData={setDossierData} onNext={() => {}} isReadOnly />}
                {consultationTab === 'entreprise' && <EntreprisePage formData={dossier} setFormData={setDossierData} onNext={() => {}} isReadOnly />}
                {consultationTab === 'activite' && <ActiviteMarchePage formData={dossier} setFormData={setDossierData} onNext={() => {}} isReadOnly />}
                {consultationTab === 'compteDeResultat' && <CompteDeResultatPage formData={dossier} setFormData={setDossierData} onNext={() => {}} isReadOnly />}
                {consultationTab === 'bilan' && <BilanPage formData={dossier} setFormData={setDossierData} onNext={() => {}} isReadOnly />}
                {consultationTab === 'historique' && <HistoriquePage formData={dossier} setFormData={setDossierData} onNext={() => {}} isReadOnly />}
                {consultationTab === 'tresorerie' && <TresoreriePage formData={dossier} setFormData={setDossierData} onNext={() => {}} isReadOnly />}
                {consultationTab === 'ratios' && <RatiosPage formData={dossier} setFormData={setDossierData} onNext={() => {}} isReadOnly />}
                {consultationTab === 'echeancier' && <EcheancierPage formData={dossier} setFormData={setDossierData} onNext={() => {}} isReadOnly />}
                {consultationTab === 'calculs' && <CalculsOptionnelsPage formData={dossier} setFormData={setDossierData} onSubmit={() => {}} isReadOnly />}
            </div>
        </>
    );

    const renderAnalysisView = () => (
         <>
            <nav className="flex border-b border-gray-300 hide-on-print overflow-x-auto">
                 {ANALYSIS_TABS_ORDER.map(tab => (
                    <button 
                        key={tab}
                        onClick={() => setAnalysisTab(tab)} 
                        className={`px-3 py-2 text-xs font-medium rounded-t-lg transition-colors ${analysisTab === tab ? 'bg-white text-purple-600 border-b-2 border-purple-600' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}>
                        {ANALYSIS_TABS_LABELS[tab]}
                    </button>
                 ))}
            </nav>
            <div className="mt-1 bg-white shadow-lg rounded-b-lg">
                {analysisTab === 'entrepreneur' && <AnalyseEntrepreneurPage formData={dossier} setFormData={setDossierData} onNext={handleNextAnalysis} />}
                {analysisTab === 'entreprise' && <AnalyseEntreprisePage formData={dossier} setFormData={setDossierData} onNext={handleNextAnalysis} />}
                {analysisTab === 'activite' && <AnalyseActivitePage formData={dossier} setFormData={setDossierData} onNext={handleNextAnalysis} />}
                {analysisTab === 'cashFlow' && <AnalyseCashFlowPage formData={dossier} setFormData={setDossierData} onNext={handleNextAnalysis} />}
                {analysisTab === 'historique' && <AnalyseHistoriquePage formData={dossier} setFormData={setDossierData} onNext={handleNextAnalysis} />}
                {analysisTab === 'ponderation' && <PonderationPage dossier={dossier} setDossierData={setDossierData} updateDossierStatus={updateDossierStatus} onBack={onBack} />}
            </div>
        </>
    );

    return (
        <div>
            <div className="flex justify-between items-center bg-gray-50 p-3 rounded-t-lg border-b">
                <button onClick={onBack} className="text-blue-600 hover:underline">
                    &larr; Retour au tableau de bord
                </button>
                <h2 className="text-lg font-bold">Dossier: {dossier.affaire} ({dossier.dossier})</h2>
                <div className="space-x-2">
                    <button onClick={handleSendBack} className="bg-yellow-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-yellow-600">
                        Renvoyer pour modification
                    </button>
                </div>
            </div>

             <div className="border-b border-gray-300">
                <button onClick={() => setMainTab('CONSULTATION')} className={`px-6 py-3 text-lg font-semibold ${mainTab === 'CONSULTATION' ? 'text-blue-600 border-b-4 border-blue-600' : 'text-gray-500'}`}>
                    Dossier Client (Consultation)
                </button>
                <button onClick={() => setMainTab('ANALYSE')} className={`px-6 py-3 text-lg font-semibold ${mainTab === 'ANALYSE' ? 'text-purple-600 border-b-4 border-purple-600' : 'text-gray-500'}`}>
                    Analyse du Dossier
                </button>
            </div>
            
            <div className="py-4">
                {mainTab === 'CONSULTATION' && renderConsultationView()}
                {mainTab === 'ANALYSE' && renderAnalysisView()}
            </div>
        </div>
    );
};

export default AnalystView;
