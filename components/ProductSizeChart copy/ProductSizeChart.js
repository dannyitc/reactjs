import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classify from 'src/classify';
import defaultClasses from './ProductSizeChart.css';
import globalClasses from 'src/index.css';
import Button from 'src/components/Button';
import Modal from 'react-animated-modal';
class ProductSizeChart extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            isPopupSizeChartOpen: false
        };
    }

    static propTypes = {
        classes: PropTypes.shape({})
    };

    showSizeChartPopup = () => {
        const { modalIsOpen } = globalClasses;
        const bodyClasses = document.querySelector('body').classList;
        this.setState({
            isPopupSizeChartOpen: true
        });
        bodyClasses.add(modalIsOpen);
    };

    hideSizeChartPopup = () => {
        const { modalIsOpen } = globalClasses;
        const bodyClasses = document.querySelector('body').classList;
        this.setState({
            isPopupSizeChartOpen: false
        });
        bodyClasses.remove(modalIsOpen);
    };

    get sizeChartPopup() {
        const { popupWrapper, popupContent, pschartShowsizes, 
            pschartContent, tg, tg1fw3, tgKycl, tgQk8y, tg9rfm, tgPel5, tgObcr, pschartPopupInternal
         } = defaultClasses;
        return (
            <Modal
                visible={this.state.isPopupSizeChartOpen}
                closemodal={this.hideSizeChartPopup}
                type="slideInUp"
            > 
                <div className={popupWrapper}>
                    <div className={popupContent}>
                        <div className={pschartShowsizes}>
                            <div className={pschartPopupInternal}>
                                    <div className={pschartContent}>
                                        <table className={tg}>
                                            <tbody>
                                                <tr>
                                                    <th className={tg1fw3} colSpan={5}>
                                                        SUITS, JACKETS, BLAZERS
                                                    </th>
                                                </tr>
                                                <tr>
                                                    <td
                                                        className={tg1fw3}
                                                        colSpan={2}
                                                        rowSpan={2}
                                                    >
                                                        CHEST
                                                    </td>
                                                    <td className={tg1fw3} colSpan={3}>
                                                        SLEEVE LENGTH
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td className={tg1fw3}>SHORT</td>
                                                    <td className={tg1fw3}>REG</td>
                                                    <td className={tg1fw3}>LONG</td>
                                                </tr>
                                                <tr>
                                                    <td className={tgKycl}>INCHES</td>
                                                    <td className={tgKycl}>EU</td>
                                                    <td className={tgKycl}>INCHES</td>
                                                    <td className={tgKycl}>INCHES</td>
                                                    <td className={tgKycl}>INCHES</td>
                                                </tr>
                                                <tr>
                                                    <td className={tgKycl}>34</td>
                                                    <td className={tgKycl}>44</td>
                                                    <td className={tgKycl}>23.9</td>
                                                    <td className={tgKycl}>24.9</td>
                                                    <td className={tgKycl}>25.9</td>
                                                </tr>
                                                <tr>
                                                    <td className={tgKycl}>36</td>
                                                    <td className={tgKycl}>46</td>
                                                    <td className={tgKycl}>24.1</td>
                                                    <td className={tgKycl}>34</td>
                                                    <td className={tgKycl}>26.1</td>
                                                </tr>
                                                <tr>
                                                    <td className={tgKycl}>38</td>
                                                    <td className={tgKycl}>48</td>
                                                    <td className={tgKycl}>24.4</td>
                                                    <td className={tgKycl}>25.4</td>
                                                    <td className={tgKycl}>26.3</td>
                                                </tr>
                                                <tr>
                                                    <td className={tgKycl}>40</td>
                                                    <td className={tgKycl}>50</td>
                                                    <td className={tgKycl}>24.6</td>
                                                    <td className={tgKycl}>25.6</td>
                                                    <td className={tgKycl}>26.6</td>
                                                </tr>
                                                <tr>
                                                    <td className={tgKycl}>42</td>
                                                    <td className={tgKycl}>52</td>
                                                    <td className={tgKycl}>24.8</td>
                                                    <td className={tgKycl}>25.8</td>
                                                    <td className={tgKycl}>26.8</td>
                                                </tr>
                                                <tr>
                                                    <td className={tgKycl}>44</td>
                                                    <td className={tgKycl}>54</td>
                                                    <td className={tgKycl}>25.1</td>
                                                    <td className={tgKycl}>26.1</td>
                                                    <td className={tgKycl}>27.0</td>
                                                </tr>
                                                <tr>
                                                    <td className={tgKycl}>46</td>
                                                    <td className={tgKycl}>56</td>
                                                    <td className={tgKycl}>25.3</td>
                                                    <td className={tgKycl}>26.3</td>
                                                    <td className={tgKycl}>27.3</td>
                                                </tr>
                                                <tr>
                                                    <td className={tgKycl}>48</td>
                                                    <td className={tgKycl}>58</td>
                                                    <td className={tgKycl}>25.6</td>
                                                    <td className={tgKycl}>26.5</td>
                                                    <td className={tgKycl}>27.5</td>
                                                </tr>
                                                <tr>
                                                    <td className={tgKycl}>50</td>
                                                    <td className={tgKycl}>60</td>
                                                    <td className={tgKycl}>25.8</td>
                                                    <td className={tgKycl}>26.8</td>
                                                    <td className={tgKycl}>27.8</td>
                                                </tr>
                                                <tr>
                                                    <td className={tgKycl}>52</td>
                                                    <td className={tgKycl}>62</td>
                                                    <td className={tgKycl}>26.0</td>
                                                    <td className={tgKycl}>27.0</td>
                                                    <td className={tgKycl}>28.0</td>
                                                </tr>
                                                <tr>
                                                    <td className={tgKycl}>54</td>
                                                    <td className={tgKycl}>64</td>
                                                    <td className={tgKycl}>26.3</td>
                                                    <td className={tgKycl}>27.2</td>
                                                    <td className={tgKycl}>28.2</td>
                                                </tr>
                                                <tr>
                                                    <td className={tgKycl}>56</td>
                                                    <td className={tgKycl}>66</td>
                                                    <td className={tgKycl}>26.5</td>
                                                    <td className={tgKycl}>27.5</td>
                                                    <td className={tgKycl}>28.5</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                        <p />
                                        <p />
                                        <table className={tg}>
                                            <tbody>
                                                <tr>
                                                    <th className={tgQk8y} colSpan={4}>
                                                        TROUSERS
                                                    </th>
                                                </tr>
                                                <tr>
                                                    <td className={tgQk8y}>
                                                        WAIST TO FIT
                                                    </td>
                                                    <td
                                                        className={tgObcr}
                                                        colSpan={3}
                                                        rowSpan={2}
                                                    >
                                                        INSIDE LEG
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td className={tgQk8y}>SIZE</td>
                                                </tr>
                                                <tr>
                                                    <td className={tg9rfm}>
                                                        INCHES&nbsp;
                                                    </td>
                                                    <td className={tg9rfm}>Short</td>
                                                    <td className={tg9rfm}>Regular</td>
                                                    <td className={tg9rfm}>Long</td>
                                                </tr>
                                                <tr>
                                                    <td className={tg9rfm}>28</td>
                                                    <td className={tgPel5} rowSpan={12}>
                                                        30"
                                                    </td>
                                                    <td className={tgPel5} rowSpan={12}>
                                                        32"
                                                    </td>
                                                    <td className={tgPel5} rowSpan={12}>
                                                        34"
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td className={tg9rfm}>30</td>
                                                </tr>
                                                <tr>
                                                    <td className={tg9rfm}>32</td>
                                                </tr>
                                                <tr>
                                                    <td className={tg9rfm}>34</td>
                                                </tr>
                                                <tr>
                                                    <td className={tg9rfm}>36</td>
                                                </tr>
                                                <tr>
                                                    <td className={tg9rfm}>38</td>
                                                </tr>
                                                <tr>
                                                    <td className={tg9rfm}>40</td>
                                                </tr>
                                                <tr>
                                                    <td className={tg9rfm}>42</td>
                                                </tr>
                                                <tr>
                                                    <td className={tg9rfm}>44</td>
                                                </tr>
                                                <tr>
                                                    <td className={tg9rfm}>46</td>
                                                </tr>
                                                <tr>
                                                    <td className={tg9rfm}>48</td>
                                                </tr>
                                                <tr>
                                                    <td className={tg9rfm}>50</td>
                                                </tr>
                                                <tr>
                                                    <td className={tgQk8y} colSpan={4}>
                                                        LEG LENGTH IS STYLE DEPENDANT
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td className={tgQk8y} colSpan={4}>
                                                        *Marc Darcy suits have 1" shorter
                                                        inside leg
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                        <h3>
                                            All suits are Regular length unless otherwise
                                            specified or there is an option to choose.
                                        </h3>
                                    </div>
                                </div>
                        </div>
                    </div>
                </div>
            </Modal>
        );
    }
    render() {
        return (
            <div>
                {this.sizeChartPopup}
                <Button
                    classCustom="sizechart"
                    onClick={this.showSizeChartPopup}
                >
                    Size Chart
                </Button>
            </div>
        );
    }
}

export default ProductSizeChart;
