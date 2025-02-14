import { Link } from "react-router-dom"

function Navbar() {
	return (
		<>
			<div className="flex justify-center w-full p-4 text-white bg-indigo-900">
				<div className="container flex justify-between text-lg">
					<Link
						to="/home"
						className="text-2xl font-bold
					">
						Blog Pessoal
					</Link>
					<div className="flex gap-4">
						Postagens Temas Cadastrar tema Perfil
						<Link to='/login'>
							Sair
						</Link>
					</div>
				</div>
			</div>
		</>
	)
}

export default Navbar
