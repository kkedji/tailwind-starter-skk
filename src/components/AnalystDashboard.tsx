
import React from 'react';
import { CreditApplicationData, statusLabelMapping } from '../types.ts';

interface AnalystDashboardProps {
  dossiers: CreditApplicationData[];
  onSelectDossier: (id: string) => void;
}

const AnalystDashboard: React.FC<AnalystDashboardProps> = ({ dossiers, onSelectDossier }) => {
  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Tableau de Bord - Analyste de Crédit</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                N° Dossier
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Affaire / Client
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date Soumission
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Statut
              </th>
              <th scope="col" className="relative px-6 py-3">
                <span className="sr-only">Ouvrir</span>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {dossiers.length > 0 ? dossiers.map((dossier) => (
              <tr key={dossier.id} className="hover:bg-gray-100">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{dossier.dossier}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{dossier.affaire}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(dossier.history.find(h => h.action.includes("Soumission"))?.date || dossier.dateDepot).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                   <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                       dossier.status === 'RETOUR_ANALYSE' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
                   }`}>
                        {statusLabelMapping[dossier.status]}
                    </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button onClick={() => onSelectDossier(dossier.id)} className="text-indigo-600 hover:text-indigo-900">
                    Ouvrir
                  </button>
                </td>
              </tr>
            )) : (
                <tr>
                    <td colSpan={5} className="text-center py-10 text-gray-500">
                        Aucun dossier à analyser pour le moment.
                    </td>
                </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AnalystDashboard;
