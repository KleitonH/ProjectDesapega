import React, { useState } from 'react';
import './Sidebar.css'; // Importando os estilos

const Sidebar = () => {
    const [isOpen, setIsOpen] = useState(false); // Estado para controlar a abertura e fechamento da sidebar

    const toggleSidebar = () => {
        setIsOpen(!isOpen); // Alterna entre abrir e fechar
    };

    return (
        <div className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
            <div className="sidebar-header">
                <button className="toggle-btn" onClick={toggleSidebar}>
                    {isOpen ? '<<' : '>>'} {/* Botão para alternar */}
                </button>
                <div className="logo">
                    <img src="logo.png" alt="Logo" className="logo-img" /> {/* Logo da sidebar */}
                    {isOpen && <span>Desapega</span>} {/* Exibe o nome quando estiver aberto */}
                </div>
            </div>
            <ul className="sidebar-list">
                <li className="sidebar-item">
                    <span className="icon">🏠</span>
                    {isOpen && <span>Página inicial</span>}
                </li>
                <li className="sidebar-item">
                    <span className="icon">📂</span>
                    {isOpen && <span>Interesses</span>}
                </li>
                <li className="sidebar-item">
                    <span className="icon">👍</span>
                    {isOpen && <span>Curtidos</span>}
                </li>
                <li className="sidebar-item">
                    <span className="icon">💬</span>
                    {isOpen && <span>Conversas</span>}
                </li>
                <li className="sidebar-item">
                    <span className="icon">👤</span>
                    {isOpen && <span>Perfil</span>}
                </li>
            </ul>
        </div>
    );
};

export default Sidebar;
