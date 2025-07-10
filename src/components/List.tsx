import { useEffect, useState } from 'react';
import {
  fetchRickAndMortyCharacters,
  fetchRickAndMortyEpisodes,
  fetchRickAndMortyLocations,
  type RMCharacter,
  type RMEpisode,
  type RMLocation,
} from '../utils/rick-and-morty-api';
import Pagination from './Pagination.tsx';
import placeholder from '../../assets/no-image-300x300.jpeg';
import styles from './List.module.less';

type ListProps = {
  view: 'characters' | 'episodes' | 'locations';
};

const PAGE_SIZE = 50;

const List = ({ view }: ListProps) => {
  const [chars, setChars] = useState<RMCharacter[]>([]);
  const [episodes, setEpisodes] = useState<RMEpisode[]>([]);
  const [locations, setLocations] = useState<RMLocation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);

  useEffect(() => {
    setLoading(true);
    setError(null);
    setPage(0);

    const fetchData = async () => {
      try {
        if (view === 'characters') {
          const data = await fetchRickAndMortyCharacters();
          setChars(data);
        } else if (view === 'episodes') {
          const data = await fetchRickAndMortyEpisodes();
          setEpisodes(data);
        } else if (view === 'locations') {
          const data = await fetchRickAndMortyLocations();
          setLocations(data);
        }
      } catch {
        setError('Failed to load data.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [view]);

  let data: RMCharacter[] | RMEpisode[] | RMLocation[] = [];
  if (view === 'characters') data = chars;
  if (view === 'episodes') data = episodes;
  if (view === 'locations') data = locations;
  const totalPages = Math.ceil(data.length / PAGE_SIZE);

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    const visiblePages = Math.min(3, totalPages);
    const pageOptions = [
      { value: 'start', label: 'Start', disabled: page === 0 },
      ...Array.from({ length: visiblePages }, (_, i) => ({
        value: i,
        label: (i + 1).toString(),
        disabled: false,
      })),
      ...(totalPages > 3
        ? [
            {
              value: totalPages - 1,
              label: totalPages.toString(),
              disabled: false,
            },
          ]
        : []),
      { value: 'next', label: 'Next', disabled: page >= totalPages - 1 },
    ];

    const handleChange = (val: string | number) => {
      if (val === 'start') setPage(0);
      else if (val === 'next') setPage((p) => Math.min(p + 1, totalPages - 1));
      else setPage(Number(val));
    };

    return (
      <div className={styles.paginationRow}>
        <SelectButton
          options={pageOptions}
          value={page}
          onChange={handleChange}
          className={styles.pageButton}
        />
      </div>
    );
  };

  return (
    <main>
      {loading && <p>Loading {view}…</p>}
      {error && <p className={styles.error}>{error}</p>}

      {view === 'characters' && (
        <>
          <table className={styles.listTable}>
            <thead>
              <tr>
                <th>Interdimensional Mugshot</th>
                <th>Probably Their Name</th>
                <th>Planetary Genotype</th>
                <th>Gender Stereotype</th>
                <th>Currently Screwing Around In</th>
                <th>Breathing or Buried</th>
              </tr>
            </thead>
            <tbody>
              {chars
                .slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE)
                .map((c) => (
                  <tr key={c.id}>
                    <td>
                      <img
                        src={c.image || placeholder}
                        alt={c.name}
                        width={50}
                        height={50}
                      />
                    </td>
                    <td>{c.name}</td>
                    <td>{c.species}</td>
                    <td>{c.gender}</td>
                    <td>
                      <div className={styles.labelRow}>
                        <span>Last known:</span>
                        <span>{c.location.name}</span>
                      </div>
                      <div className={styles.labelRow}>
                        <span>Origin:</span>
                        <span>{c.origin.name}</span>
                      </div>
                    </td>
                    <td>{c.status}</td>
                  </tr>
                ))}
            </tbody>
          </table>
          <div className={styles.cardList}>
            {chars.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE).map((c) => (
              <div className={styles.card} key={c.id}>
                <img src={c.image || placeholder} alt={c.name} />
                <div className={styles.cardContent}>
                  <div className={styles.cardTitle}>{c.name}</div>
                  <div className={styles.cardField}>
                    <span className={styles.cardLabel}>Species:</span>
                    <span>{c.species}</span>
                  </div>
                  <div className={styles.cardField}>
                    <span className={styles.cardLabel}>Gender:</span>
                    <span>{c.gender}</span>
                  </div>
                  <div className={styles.cardField}>
                    <span className={styles.cardLabel}>Last known:</span>
                    <span>{c.location.name}</span>
                  </div>
                  <div className={styles.cardField}>
                    <span className={styles.cardLabel}>Origin:</span>
                    <span>{c.origin.name}</span>
                  </div>
                  <div className={styles.cardField}>
                    <span className={styles.cardLabel}>Status:</span>
                    <span>{c.status}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {renderPagination()}
        </>
      )}

      {view === 'episodes' && (
        <>
          <table className={styles.listTable}>
            <thead>
              <tr>
                <th>Chronological Blip</th>
                <th>Title You’ll Forget Anyway</th>
                <th>Air Date, Woohoo</th>
                <th>Population of This Mess</th>
              </tr>
            </thead>
            <tbody>
              {episodes
                .slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE)
                .map((ep) => (
                  <tr key={ep.id}>
                    <td>{ep.episode}</td>
                    <td>{ep.name}</td>
                    <td>{ep.air_date}</td>
                    <td>{ep.characters.length}</td>
                  </tr>
                ))}
            </tbody>
          </table>
          <div className={styles.cardList}>
            {episodes
              .slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE)
              .map((ep) => (
                <div className={styles.card} key={ep.id}>
                  <div className={styles.cardContent}>
                    <div className={styles.cardTitle}>{ep.name}</div>
                    <div className={styles.cardField}>
                      <span className={styles.cardLabel}>Episode:</span>
                      <span>{ep.episode}</span>
                    </div>
                    <div className={styles.cardField}>
                      <span className={styles.cardLabel}>Air Date:</span>
                      <span>{ep.air_date}</span>
                    </div>
                    <div className={styles.cardField}>
                      <span className={styles.cardLabel}>Characters:</span>
                      <span>{ep.characters.length}</span>
                    </div>
                  </div>
                </div>
              ))}
          </div>
          {renderPagination()}
        </>
      )}

      {view === 'locations' && (
        <>
          <table className={styles.listTable}>
            <thead>
              <tr>
                <th>Ugh, The Place</th>
                <th>What It Technically Is</th>
                <th>Dimensional Whatever</th>
              </tr>
            </thead>
            <tbody>
              {locations
                .slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE)
                .map((loc) => (
                  <tr key={loc.id}>
                    <td>{loc.name}</td>
                    <td>{loc.type}</td>
                    <td>{loc.dimension}</td>
                  </tr>
                ))}
            </tbody>
          </table>
          <div className={styles.cardList}>
            {locations
              .slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE)
              .map((loc) => (
                <div className={styles.card} key={loc.id}>
                  <div className={styles.cardContent}>
                    <div className={styles.cardTitle}>{loc.name}</div>
                    <div className={styles.cardField}>
                      <span className={styles.cardLabel}>Type:</span>
                      <span>{loc.type}</span>
                    </div>
                    <div className={styles.cardField}>
                      <span className={styles.cardLabel}>Dimension:</span>
                      <span>{loc.dimension}</span>
                    </div>
                  </div>
                </div>
              ))}
          </div>
          {renderPagination()}
        </>
      )}
    </main>
  );
};

export default List;
