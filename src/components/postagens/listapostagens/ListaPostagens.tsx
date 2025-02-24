import { useNavigate } from "react-router-dom"
import CardPostagens from "../cardpostagens/CardPostagens"
import { useState, useContext, useEffect } from "react"
import { AuthContext } from "../../../contexts/AuthContext"
import Postagem from "../../../models/Postagem"
import { buscar } from "../../../services/Service"
import { DNA } from "react-loader-spinner"
import { ToastAlerta } from "../../../utils/ToastAlerta"

function ListaPostagens() {
	const navigate = useNavigate()

	const [postagens, setPostagens] = useState<Postagem[]>([])
	const [isLoading, setIsLoading] = useState<boolean>(false)

	const { usuario, handleLogout } = useContext(AuthContext)
	const token = usuario.token

	async function buscarPostagens() {

		setIsLoading(true)

		try {
			await buscar("/postagens", setPostagens, {
				headers: {
					Authorization: token,
				},
			})
		} catch (error: any) {
			if (error.toString().includes("401")) {
				handleLogout()
			}
		}finally{
			setIsLoading(false)
		}
	}

	useEffect(() => {
		if (token === "") {
			ToastAlerta("Você precisa estar logado", 'info')
			navigate("/")
		}
	}, [token])

	useEffect(() => {
		buscarPostagens()
	}, [postagens.length])

	return (
		<>
			{isLoading && (
				<DNA
					visible={true}
					height="200"
					width="200"
					ariaLabel="dna-loading"
					wrapperStyle={{}}
					wrapperClass="dna-wrapper mx-auto"
				/>
			)}

			<div className="flex justify-center w-full my-4">
				<div className="container flex flex-col mx-2">
					{ (!isLoading && postagens.length === 0) && (
						<span className="text-3xl text-center my-8">
							Nenhuma Postagem foi encontrada!
						</span>
					)}

					<div
						className="container mx-auto my-4 
                        grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
					>
						{postagens
							.sort((a, b) => a.id - b.id)
							.map((postagem) => (
							<CardPostagens key={postagem.id} postagem={postagem} />
						))}
					</div>
				</div>
			</div>
		</>
	)
}

export default ListaPostagens
