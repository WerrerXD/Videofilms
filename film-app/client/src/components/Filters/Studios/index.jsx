import React, {useEffect, useState} from 'react';
import FiltersSelect from 'components/Select';
import { useDispatch, useSelector } from 'react-redux';
import { setQueryStudios } from 'store/Slices/querySlice';
import {fetchStudios} from "../../../http/moviesAPI";

const Studios = () => {
    const [studioOptions, setStudioOptions] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadStudios = async () => {
            try {
                const studios = await fetchStudios();
                const formattedStudios = studios.map(studio => ({
                    value: studio.name,
                    label: `${studio.name} (${studio.country})`,
                }));
                setStudioOptions(formattedStudios);
            } catch (error) {
                console.error('Failed to fetch studios:', error);
            } finally {
                setIsLoading(false);
            }
        };

        loadStudios();
    }, []);

    return (
        <FiltersSelect
            options={studioOptions} // Передаем массив доступных студий
            label="Студия"
            placeholder="Выберите студию"
            storeParam="studioName"
            action={setQueryStudios}
        />
    );
};

export default Studios;
