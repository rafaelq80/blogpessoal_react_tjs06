import { ReactNode, useContext } from "react"
import { Link, useNavigate } from "react-router-dom"
import { AuthContext } from "../../contexts/AuthContext"
import { ToastAlerta } from "../../utils/ToastAlerta"

function Navbar() {
	const navigate = useNavigate()

	const { usuario, handleLogout } = useContext(AuthContext)

	function logout() {
		handleLogout()
		ToastAlerta("O Usuário foi desconectado com sucesso!", 'sucesso')
		navigate("/")
	}

	let componente: ReactNode;

	if (usuario.token !== ''){

		componente = (
			<div className="flex justify-center w-full p-4 text-white bg-indigo-900">
				<div className="container flex justify-between text-lg">
					<Link
						to="/home"
						className="text-2xl font-bold
					"
					>
						Blog Pessoal
					</Link>
					<div className="flex gap-4">
						<Link to="/postagens" className="hover:underline">
							Postagens
						</Link>
						<Link to="/temas" className="hover:underline">
							Temas
						</Link>
						<Link to="/cadastrartema" className="hover:underline">
							Cadastrar tema
						</Link>
						<Link to='/perfil' className='hover:underline'>Perfil</Link>
						<Link to="" onClick={logout} className="hover:underline">
							Sair
						</Link>
					</div>
				</div>
			</div>
		)
	}
	
	return (
		<>
			{componente}
		</>
	)
}

export default Navbar
