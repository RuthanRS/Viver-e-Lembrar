import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft, Phone, Plus } from 'lucide-react';

interface Contact {
  id: string;
  name: string;
  relationship: string;
  phone: string;
  photo?: string;
}

export function Contacts() {
  const navigate = useNavigate();
  const [contacts, setContacts] = useState<Contact[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('alzheimer-contacts');
    if (saved) {
      setContacts(JSON.parse(saved));
    } else {
      const defaultContacts: Contact[] = [
        { id: '1', name: 'Maria Silva', relationship: 'Esposa', phone: '(11) 98765-4321' },
        { id: '2', name: 'João Silva', relationship: 'Filho', phone: '(11) 98765-1234' },
        { id: '3', name: 'Ana Silva', relationship: 'Filha', phone: '(11) 98765-5678' },
        { id: '4', name: 'Dr. Carlos', relationship: 'Médico', phone: '(11) 3456-7890' },
        { id: '5', name: 'Emergência', relationship: 'SAMU', phone: '192' },
      ];
      setContacts(defaultContacts);
      localStorage.setItem('alzheimer-contacts', JSON.stringify(defaultContacts));
    }
  }, []);

  const makeCall = (phone: string) => {
    window.location.href = `tel:${phone}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      <div className="max-w-md mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center mb-8">
          <button 
            onClick={() => navigate('/home')}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-3xl text-purple-600 ml-4">Contatos</h1>
        </div>

        <p className="text-gray-600 mb-6">Pessoas importantes para você 📞</p>

        {/* Contacts List */}
        <div className="space-y-3 mb-6">
          {contacts.map((contact) => (
            <div
              key={contact.id}
              className="bg-white rounded-2xl p-4 shadow-md hover:shadow-lg transition-all"
            >
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-blue-100 rounded-full flex items-center justify-center text-2xl flex-shrink-0">
                  {contact.photo ? (
                    <img src={contact.photo} alt={contact.name} className="w-full h-full object-cover rounded-full" />
                  ) : (
                    '👤'
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg mb-1 truncate">{contact.name}</h3>
                  <p className="text-sm text-gray-500 mb-1">{contact.relationship}</p>
                  <p className="text-sm text-gray-600">{contact.phone}</p>
                </div>

                <button
                  onClick={() => makeCall(contact.phone)}
                  className="flex-shrink-0 w-14 h-14 bg-green-500 text-white rounded-full flex items-center justify-center hover:bg-green-600 transition-colors shadow-lg"
                >
                  <Phone className="w-6 h-6" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Add Contact Button */}
        <button className="w-full bg-purple-500 text-white py-4 rounded-full text-lg shadow-lg hover:bg-purple-600 transition-colors flex items-center justify-center gap-2">
          <Plus className="w-6 h-6" />
          Adicionar Contato
        </button>
      </div>
    </div>
  );
}
