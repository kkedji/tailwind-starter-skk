

import React, { useMemo } from 'react';
import { CreditApplicationData, DossierStatus } from '../../types.ts';
import { analysisConfig, institutionalWeights } from './analysisConfig.ts';

interface PonderationPageProps {
    dossier: CreditApplicationData;
    setDossierData: (updateFn: (prev: CreditApplicationData) => CreditApplicationData) => void;
    updateDossierStatus: (dossierId: string, newStatus: DossierStatus, action: string) => void;
    onBack: () => void;
}

const PonderationPage: React.FC<PonderationPageProps> = ({ dossier, setDossierData, updateDossierStatus, onBack }) => {

    const calculatedScores = useMemo(() => {
        const scores = {
            entrepreneur: 0,
            entreprise: 0,
            activite: 0,
            historique: 0,
            cashFlow: 0,
        };
        const weightedScores = { ...scores };

        (Object.keys(scores) as Array<keyof typeof scores>).forEach(key => {
            if (dossier.analysis && dossier.analysis[key]) {
                const sectionData = dossier.analysis[key];
                const totalScore = Object.values(sectionData).reduce((sum, factor) => sum + (factor.score || 0), 0);
                scores[key] = totalScore;
                weightedScores[key] = totalScore * (institutionalWeights[key] / 100);
            }
        });

        const totalScore = Object.values(weightedScores).reduce((sum, score) => sum + score, 0);

        let decision = "ACCORD";
        if (totalScore > 5) decision = "ACCORD AVEC RESERVES";
        if (totalScore > 15) decision = "AJOURNEMENT";
        if (totalScore > 25) decision = "REJET";
        
        return { scores, weightedScores, totalScore, decision };
    }, [dossier.analysis]);
    
    const handleMotifsChange = (newMotifs: string) => {
        setDossierData(prev => ({
            ...prev,
            scoring: {
                ...prev.scoring,
                motifs: newMotifs,
            },
        }));
    };

    const handleSubmitToDirector = () => {
        if (window.confirm("Êtes-vous sûr de vouloir soumettre votre analyse au directeur des risques ?")) {
            updateDossierStatus(dossier.id, 'EN_VALIDATION_DIRECTEUR', 'Analyse soumise au directeur');
            onBack();
        }
    };
    
    const generateSynthese = () => {
        alert("La génération de la synthèse via l'API Gemini sera bientôt disponible.");
    };

    return (
        <div className="p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-6 text-purple-700">Échelle de Pondération de Tous les Risques</h2>
            
            <div className="border border-gray-300 rounded-lg overflow-hidden">
                <table className="min-w-full text-sm">
                    <thead className="bg-gray-300">
                        <tr>
                            <th className="p-3 text-left font-bold text-black border-b border-r border-gray-400">Facteurs de Risques</th>
                            <th className="p-3 text-center font-bold text-black border-b border-r border-gray-400">Échelle de Risques (Score Obtenu)</th>
                            <th className="p-3 text-center font-bold text-black border-b border-r border-gray-400">Pondération Institutionnelle</th>
                            <th className="p-3 text-center font-bold text-black border-b border-r border-gray-400">Score (Après Pondération)</th>
                        </tr>
                    </thead>
                    <tbody className="text-black">
                        {Object.entries(analysisConfig).map(([sectionKey, config]) => {
                            const key = sectionKey as keyof typeof analysisConfig;
                            return (
                                <tr key={sectionKey} className="border-b">
                                    <td className="p-3 border-r">{config.title}</td>
                                    <td className="p-3 text-center border-r">{calculatedScores.scores[key].toFixed(2)}%</td>
                                    <td className="p-3 text-center border-r">{institutionalWeights[key]}%</td>
                                    <td className="p-3 text-center font-semibold bg-gray-100">{calculatedScores.weightedScores[key].toFixed(2)}%</td>
                                </tr>
                            );
                        })}
                    </tbody>
                    <tfoot className="bg-gray-200 font-bold text-black">
                        <tr>
                            <td colSpan={3} className="p-3 text-right">TOTAL PONDÉRATION</td>
                            <td className="p-3 text-center text-lg">{calculatedScores.totalScore.toFixed(2)}%</td>
                        </tr>
                    </tfoot>
                </table>
            </div>

            <h2 className="text-2xl font-bold mt-8 mb-4 text-purple-700">Décision sur le Dossier de Crédit</h2>

             <div className="border border-gray-300 rounded-lg overflow-hidden">
                 <table className="min-w-full text-sm">
                    <thead className="bg-gray-300">
                        <tr>
                            <th className="p-3 text-left font-bold text-black border-b border-r border-gray-400">Score Obtenu</th>
                            <th className="p-3 text-center font-bold text-black border-b border-r border-gray-400">Classes du Dossier Traité</th>
                            <th className="p-3 text-center font-bold text-black border-b border-r border-gray-400">Décision de l'Analyste</th>
                            <th className="p-3 text-center font-bold text-black border-b border-r border-gray-400">Motifs</th>
                        </tr>
                    </thead>
                    <tbody className="text-black">
                        <tr>
                            <td className="p-3 border-r text-center font-bold text-lg">{calculatedScores.totalScore.toFixed(2)}%</td>
                            <td className={`p-3 border-r text-center font-bold text-lg`}>{calculatedScores.decision}</td>
                            <td className="p-3 border-r text-center font-bold text-lg">ACCORD</td>
                            <td className="p-3">
                                <textarea 
                                    className="w-full p-2 border rounded-md text-xs bg-white text-black"
                                    rows={3}
                                    placeholder="Entrez les motifs de la décision ici..."
                                    value={dossier.scoring.motifs}
                                    onChange={(e) => handleMotifsChange(e.target.value)}
                                />
                            </td>
                        </tr>
                    </tbody>
                 </table>
             </div>
             
             <div className="p-6 mt-6 border-t">
                <h3 className="text-xl font-bold mb-4">Synthèse & Décision de l'Analyste</h3>
                <button onClick={generateSynthese} className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
                   Générer la Synthèse
                </button>
                <p className="text-sm mt-2 text-gray-600">
                   Cliquez pour générer une proposition de synthèse basée sur les données du dossier.
                </p>
            </div>

            <div className="flex justify-end mt-8">
                <button onClick={handleSubmitToDirector} className="bg-green-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-green-700">
                    Soumettre au Directeur &rarr;
                </button>
            </div>
        </div>
    );
};

export default PonderationPage;
