import styles from './Spinner.module.scss'
import classnames from "classnames";
import {FC} from "react";

export enum SpinnerTypes {
    COMMON = 'common',
}

interface SpinnerProps  {
    className?: string
    type?: SpinnerTypes
}

const Spinner: FC<SpinnerProps> = ({className = '', type = SpinnerTypes.COMMON}) => {

    const spinnerClass = classnames({
        [styles.spinner]: true,
        [styles[type]]: true,
        [className]: true,
    })

    return (
        <span className={spinnerClass}>

        </span>
    );
};

export default Spinner;