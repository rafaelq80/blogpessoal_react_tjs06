import Popup from 'reactjs-popup';
import FormPostagem from '../formpostagem/FormPostagem';

import 'reactjs-popup/dist/index.css';
import './ModalPostagem.css'

function ModalPostagem() {
    return (
        <>
            <Popup

                /**
                 * Cria o botão que será utilizado para abrir o Modal
                 */
                trigger={
                    <button 
                        className='border rounded px-4 py-2 hover:bg-white hover:text-indigo-800'>
                        Nova Postagem
                    </button>
                }
                modal
            >
                {/* Adiciona o Fomulário de Postagem dentro do modal */}
                <FormPostagem />
            </Popup>
        </>
    );
}

export default ModalPostagem;