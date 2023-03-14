import React, { useEffect, useState } from "react"
import { getMovies } from "../../services/getMovies";
import "./styles.css";
import leftArrow from "../../assets/leftArrow.svg"
import rightArrow from "../../assets/rigthArrow.svg"
import noImg from "../../assets/sem-imagem.jpg"

export class MoviesDto {
    title?: string

    image?: string

    realeaseYear?: string

    director?: string

    producer?: string

    description?: string
}

const MoviesContainer = (props: { data: MoviesDto }): JSX.Element => {
    return (
        <div className="cardMovie" style={{ display: props?.data?.title ? 'visible' : 'none' }}>
            <div className="title">{props?.data?.title}</div>
            <img
                width={250}
                height={300}
                className="imageMovie"
                src={props?.data?.image ? props?.data?.image : noImg}></img>
            {props?.data?.description ? <div className="title">{props?.data?.description} </div> : null}
            <div className="title">Ano: {props?.data?.realeaseYear}</div>
        </div>
    )
}

const ListMovies = (): JSX.Element => {
    const [movies, setMovies] = useState([]);
    const [page, setPage] = useState(1)
    const [total, setTotal] = useState(0)
    const [loading, setLoading] = useState(false)
    const [paginationControll, setPaginationControll] = useState({
        itemOne: 1,
        itemTwo: 2,
        itemThree: 3,
        LastPage: 10
    })

    useEffect(() => {
        getMoviesMethod(page, false)
    }, []);

    async function getMoviesMethod(pagination, imp) {
        setPage(pagination)
        try {
            setLoading(true)
            const moviesApi = await getMovies({ page: pagination, import: imp ? imp : undefined })

            let dataFormat = []
            for (let i = 0; i < moviesApi.data.data.length; i += 3) {
                dataFormat.push([
                    moviesApi.data.data[i],
                    moviesApi.data?.data[i + 1],
                    moviesApi.data?.data[i + 2]
                ])
            }
            setMovies(dataFormat)
            setPaginationControll({
                ...paginationControll,
                LastPage: moviesApi.data.lastPage
            })
           
            if(imp && paginationControll.itemOne !== 1){
                setPaginationControll({
                    LastPage: moviesApi.data.lastPage,
                    itemOne: paginationControll.itemOne + 3,
                    itemTwo: paginationControll.itemTwo + 3,
                    itemThree: paginationControll.itemThree + 3,
                })
            }
            if (pagination === paginationControll.itemThree && pagination < paginationControll.LastPage){
                setPaginationControll({
                    LastPage: moviesApi.data.lastPage,
                    itemOne: paginationControll.itemOne + 1,
                    itemTwo: paginationControll.itemTwo + 1,
                    itemThree: paginationControll.itemThree + 1,
                })
            } else {
                if (pagination === paginationControll.itemOne && paginationControll.itemOne !== 1) {
                    setPaginationControll({
                        LastPage: moviesApi.data.lastPage,
                        itemOne: paginationControll.itemOne - 1,
                        itemTwo: paginationControll.itemTwo - 1,
                        itemThree: paginationControll.itemThree - 1,
                    })
                }
            } 
            window.scrollTo(0, 0)
            
            setLoading(false)

        } catch (e) {
            console.log(e)
            setLoading(false)
        }

    }
    return (
        <div className="container">
            <div className="containerFatherMovies">
                <div className="containerMoviesCenter">
                    {movies.length === 0 || paginationControll.LastPage === page ? <button onClick={() => {
                        getMoviesMethod(paginationControll.LastPage === page ? page + 1 : page, true)
                    
                    }}>
                        Carregar Filmes
                    </button> : null}
                    {!loading ? movies.map(e => {
                        return <div className="containerLineMovies">
                            <MoviesContainer data={e[0]} />
                            <MoviesContainer data={e[1]} />
                            <MoviesContainer data={e[2]} />
                        </div>
                    }) :
                        <div className="title">Carregando...</div>
                    }
                </div>
            </div>
            {movies.length > 0 ?
                <div className="paginationEvent">
                    <button className="iconWhiteBack" onClick={() => {
                        getMoviesMethod(page - 1, false)
                    }}>
                        <img src={leftArrow} alt="Voltar" />
                    </button>
                    <button className={paginationControll.itemOne === page ? "colorSelectedButton" : "buttonPaginationEvents"} onClick={() => {
                        getMoviesMethod(paginationControll.itemOne, false)
                    }}>{paginationControll.itemOne}</button>
                    <button className={paginationControll.itemTwo === page ? "colorSelectedButton" : "buttonPaginationEvents"} onClick={() => {
                        getMoviesMethod(paginationControll.itemTwo, false)
                    }}>{paginationControll.itemTwo}</button>
                    <button className={paginationControll.itemThree === page ? "colorSelectedButton" : "buttonPaginationEvents"} onClick={() => {
                        getMoviesMethod(paginationControll.itemThree, false)
                    }}>{paginationControll.itemThree}</button>

                    <button className="iconWhiteBack" disabled={page === paginationControll.LastPage} onClick={() => {
                        getMoviesMethod(page + 1, false)
                    }}>
                        <img src={rightArrow} alt="Voltar" />
                    </button>



                </div>
                : null}
        </div>
    )
}

export default ListMovies