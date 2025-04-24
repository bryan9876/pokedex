import React, { useEffect, useState } from 'react';

const Cards = () => {
    const [pokemons, setPokemons] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [offset, setOffset] = useState(0);
    const [isSearching, setIsSearching] = useState(false);
    const limit = 20;

    const fetchPokemons = async (currentOffset) => {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${currentOffset}`);
        const data = await response.json();

        const details = await Promise.all(
            data.results.map(async (pokemon) => {
                const res = await fetch(pokemon.url);
                return await res.json();
            })
        );

        setPokemons(prev => {
            const newOnes = details.filter(p => !prev.some(existing => existing.id === p.id));
            return [...prev, ...newOnes];
        });
    };

    // Buscar Pokémon por nombre exacto
    const handleSearch = async (e) => {
        const term = e.target.value.toLowerCase();
        setSearchTerm(term);

        if (term === '') {
            // Reiniciar búsqueda y volver a cargar desde el inicio
            setIsSearching(false);
            setPokemons([]);
            setOffset(0); // useEffect se encargará de hacer fetchPokemons(0)
            return;
        }

        try {
            const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${term}`);
            if (!res.ok) throw new Error('No encontrado');
            const data = await res.json();
            setIsSearching(true);
            setPokemons([data]);
        } catch (err) {
            setIsSearching(true);
            setPokemons([]);
        }
    };

    useEffect(() => {
        if (!isSearching) {
            fetchPokemons(offset);
        }
    }, [offset, isSearching]);

    const loadMore = () => {
        setOffset(prev => prev + limit);
    };

    return (
        <>
            <div className='cont-filter'>
                <label className='input-group-text'>
                    <i className="bi bi-search"></i>
                </label>
                <input
                    type="text"
                    placeholder='Search Pokémon'
                    className='filter-input'
                    value={searchTerm}
                    onChange={handleSearch}
                />
            </div>

            <div className='cont-cards'>
                {pokemons.length > 0 ? (
                    pokemons.map((poke, index) => (
                        <div className='card' key={index}>
                            <img
                                src={poke.sprites.other['official-artwork'].front_default}
                                alt={poke.name}
                                className='poke-img'
                            />
                            <h3>{poke.name.charAt(0).toUpperCase() + poke.name.slice(1)}</h3>
                            <p>{poke.types.map(t => t.type.name).join(", ")}</p>
                            <div className='stats'>
                                {poke.stats.slice(0, 4).map(stat => (
                                    <div key={stat.stat.name}>
                                        <label>{stat.stat.name.toUpperCase()}</label>
                                        <div className='bar'>
                                            <div
                                                className='progress'
                                                style={{ width: `${stat.base_stat}%` }}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))
                ) : (
                    <p style={{ textAlign: 'center', marginTop: '2rem' }}>No se encontraron resultados</p>
                )}
            </div>

            {!isSearching && pokemons.length > 0 && (
                <div className='cont-button'>
                    <button className='btn-load' onClick={loadMore}>Cargar más...</button>
                </div>
            )}
        </>
    );
};

export default Cards;
