import { useState, useContext, useEffect, ChangeEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../../../contexts/AuthContext";
import Postagem from "../../../models/Postagem";
import Tema from "../../../models/Tema";
import { buscar, atualizar, cadastrar } from "../../../services/Service";
import { RotatingLines } from "react-loader-spinner";
import { ToastAlerta } from "../../../utils/ToastAlerta";

function FormPostagem() {

    const navigate = useNavigate();

    const [isLoading, setIsLoading] = useState<boolean>(false)
    
    /**
     * Estado utilizado para carregar os dados de todos os temas, que serão
     * utilizados para alimentar o campo tema do formulário (select)
     */
    const [temas, setTemas] = useState<Tema[]>([])

    /**
     * Estado utilizado para armazenar o tema selecionado no campo tema 
     * do formulário (select), que será utilizado para adicionar o tema
     * na postagem
     */
    const [tema, setTema] = useState<Tema>({ id: 0, descricao: '', })
    
    /**
     * Estado utilizado para armazenar a postagem, que será utilizado 
     * persistida ou atualizada na aplicação
     */
    const [postagem, setPostagem] = useState<Postagem>({} as Postagem)

    const { id } = useParams<{ id: string }>()

    const { usuario, handleLogout } = useContext(AuthContext)
    const token = usuario.token

    /**
     * Função para buscar os dados da postagem pelo id
     */
    async function buscarPostagemPorId(id: string) {
        try {
            await buscar(`/postagens/${id}`, setPostagem, {
                headers: { Authorization: token }
            })
        } catch (error: any) {
            if (error.toString().includes('403')) {
                handleLogout()
            }
        }
    }

    /**
     * Função para buscar os dados de um tema específico pelo id
     */
    async function buscarTemaPorId(id: string) {
        try {
            await buscar(`/temas/${id}`, setTema, {
                headers: { Authorization: token }
            })
        } catch (error: any) {
            if (error.toString().includes('403')) {
                handleLogout()
            }
        }
    }

    /**
     * Função para buscar os dados de todos os temas
     */
    async function buscarTemas() {
        try {
            await buscar('/temas', setTemas, {
                headers: { Authorization: token }
            })
        } catch (error: any) {
            if (error.toString().includes('403')) {
                handleLogout()
            }
        }
    }

    useEffect(() => {
        if (token === '') {
            ToastAlerta('Você precisa estar logado', 'info');
            navigate('/');
        }
    }, [token])

    
	/**
	 * O segundo Hook useEffect será executado sempre que houver
	 * uma mudança na constante id (id da postagem que foi enviada na rota, sempre
     * que o formulário for utilizado em uma atualização).
	 *
	 * Quando o Componente é carregado e em todas as vezes que ocorrer uma mudança 
     * na variável id, a função buscarTemas() será executada para atualizar a listagem 
     * de temas, que será utilizada para alimentar o campo tema do formulário (select)
     * 
     * Além disso, será verificado se o id possui um valor válido. Em caso afirmativo,
     * a função buscarPostagemPorId será executada para carregar os dados da postagem
     * que será atualizada.
     */
    useEffect(() => {
        buscarTemas()

        if (id !== undefined) {
            buscarPostagemPorId(id)
        }
    }, [id])

    /**
	 * O terceiro Hook useEffect será executado sempre que houver uma alteração
	 * no estado tema, que armazenará o tema selecionado no campo tema (select)
     * do formulário.
	 *
	 * Na prática, todas as vezes que o usuário selecionar ou alterar o tema
     * da postagem, a função setPostagem irá atualizar o tema associado a postagem,
     * mantendo os demais dados da postagem inalterados.
     */
    useEffect(() => {
        setPostagem({
            ...postagem,
            tema: tema,
        })
    }, [tema])

    /**
	 * A função atualizarEstado é utilizada para atualizar dinamicamente os dados
	 * dos atributos do Estado postagem, que será enviado para o Backend.
	 *
	 * Quando um elemento input do Formulário for modificado, ou seja, o usuário
	 * digitar alguma coisa nos inputs, esta função atualizará os dados do estado postagem,
	 * mantendo todos os valores armazenados anteriormente, através do Operador Spread.
     * 
	 * Além disso, o atributo associado ao input, que teve o seu valor alterado,
	 * será atualizado com o novo valor digitado pelo usuário.
	 *
	 * [e.target.name] 🡪 Propriedade name do input que foi modificado
	 *
	 * e.target.value 🡪 Valor atual digitado dentro do input.
	 *
	 * Como as propriedades name de todos os inputs, possuem os mesmos nomes dos atributos
	 * definidos no Estado usuario, o valor do input que foi modificado, será atribuído
	 * ao respectivo atributo do Estado usuario.
     * 
     * Observe que o atributo tema também será atualizado com o valor atual armazenado no 
     * estado tema e o atributo usuario será atualizado com o valor atual armazenado no
     * estado usuario, que foi criado na context (Estado Global da aplicação, utilizado para
     * armazenar os dados do usuário autenticado).
	 */
    function atualizarEstado(e: ChangeEvent<HTMLInputElement>) {
        setPostagem({
            ...postagem,
            [e.target.name]: e.target.value,
            tema: tema,
            usuario: usuario,
        });
    }

    function retornar() {
        navigate('/postagens');
    }

    async function gerarNovaPostagem(e: ChangeEvent<HTMLFormElement>) {
        e.preventDefault()
        setIsLoading(true)

        if (id !== undefined) {
            try {
                await atualizar(`/postagens`, postagem, setPostagem, {
                    headers: {
                        Authorization: token,
                    },
                });

                ToastAlerta('Postagem atualizada com sucesso', 'sucesso')

            } catch (error: any) {
                if (error.toString().includes('403')) {
                    handleLogout()
                } else {
                    ToastAlerta('Erro ao atualizar a Postagem', 'erro')
                }
            }

        } else {
            try {
                await cadastrar(`/postagens`, postagem, setPostagem, {
                    headers: {
                        Authorization: token,
                    },
                })

                ToastAlerta('Postagem cadastrada com sucesso', 'sucesso');

            } catch (error: any) {
                if (error.toString().includes('403')) {
                    handleLogout()
                } else {
                    ToastAlerta('Erro ao cadastrar a Postagem', 'erro');
                }
            }
        }

        setIsLoading(false)
        retornar()
    }

    /**
     * Esta constante é do tipo boolean e indica se um tema foi selecionado. 
     * 
     * Ela será utilizada para desabilitar/habilitar o botão cadastrar/atualizar 
     * do formulário, como base na seleção do tema.
     * 
     * Se um tema for selecionado, ela assume o valor false (habilita o botão), 
     * caso contrário ela se manterá com o valor true (desabilita o botão).
     * 
     */
    const carregandoTema = tema.descricao === '';

    return (
        <div className="container flex flex-col mx-auto items-center">
            <h1 className="text-4xl text-center my-8">
                {id !== undefined ? 'Editar Postagem' : 'Cadastrar Postagem'}
            </h1>

            <form className="flex flex-col w-1/2 gap-4" onSubmit={gerarNovaPostagem}>
                <div className="flex flex-col gap-2">
                    <label htmlFor="titulo">Título da Postagem</label>
                    <input
                        type="text"
                        placeholder="Titulo"
                        name="titulo"
                        required
                        className="border-2 border-slate-700 rounded p-2"
                        value={postagem.titulo}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => atualizarEstado(e)}
                    />
                </div>
                <div className="flex flex-col gap-2">
                    <label htmlFor="titulo">Texto da Postagem</label>
                    <input
                        type="text"
                        placeholder="Texto"
                        name="texto"
                        required
                        className="border-2 border-slate-700 rounded p-2"
                        value={postagem.texto}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => atualizarEstado(e)}
                    />
                </div>
                <div className="flex flex-col gap-2">
                    <p>Tema da Postagem</p>
                    <select name="tema" id="tema" className='border p-2 border-slate-800 rounded'
                        
                        /** 
                         * Busca os dados do tema selecionado pelo id e atualiza o estado tema, através da
                         * função buscarTemaPorId
                         */ 
                        onChange={(e) => buscarTemaPorId(e.currentTarget.value)}
                    >
                        <option value="" selected disabled>Selecione um Tema</option>

                        {temas.map((tema) => (
                            <>
                                {/* 
                                    Armazena o atributo id na propriedade value, mas exibe o atributo descricao para o usuário 
                                */}
                                <option value={tema.id} >{tema.descricao}</option>
                            </>
                        ))}

                    </select>
                </div>
                <button
                    type='submit'
                    className='rounded disabled:bg-slate-200 bg-indigo-400 hover:bg-indigo-800
                               text-white font-bold w-1/2 mx-auto py-2 flex justify-center'
                    
                    /**
                     * A propriedade disabled desabilita o botão, quando ela recebe o valor true.
                     * 
                     * Se a constante carregandoTema for true (não foi selecionado um tema), desabilita o botão
                     * Se a constante carregandoTema for false (foi selecionado um tema), habilita o botão
                     */ 
                    disabled={carregandoTema}
                >
                    {isLoading ?
                        <RotatingLines
                            strokeColor="white"
                            strokeWidth="5"
                            animationDuration="0.75"
                            width="24"
                            visible={true}
                        /> :
                        <span>{id !== undefined ? 'Atualizar' : 'Cadastrar'}</span>
                    }
                </button>
            </form>
        </div>
    );
}

export default FormPostagem;