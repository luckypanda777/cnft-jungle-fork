import { styled } from '@mui/material/styles';
import Select from '@mui/material/Select';

const FilterSelect = styled(Select)(({theme}) => ({
    width: 160,
    color: 'white',
    borderRadius: '10px',

    '&:hover': {
        borderColor: 'white',

        '& .MuiOutlinedInput-notchedOutline': {
            borderColor: 'white',
        },
    },

    '& .MuiSelect-select': {
        padding: '8px',
    },

    '& .MuiSvgIcon-root': {
        color: 'white'
    },

    '& .Mui-focused': {
        borderColor: 'white',
        '& .MuiOutlinedInput-notchedOutline fieldset': {
            borderColor: 'white',    
        }
    },

    '& .MuiOutlinedInput-notchedOutline': {
        borderColor: 'white',
        

        "& .Mui-focused fieldset": {
            borderColor: "white",
        }
    },

    '& .Mui-focused .MuiOutlinedInput-notchedOutline': {
        borderColor: "white",

        'fieldset': {
            borderColor: "white",   
        },
    }
}));

export default function (props) {
    return <FilterSelect displayEmpty {...props}/>
};