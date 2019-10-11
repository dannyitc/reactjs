import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classify from 'src/classify';
import defaultClasses from './Related.css';
import Slider from "react-slick";
import 'src/components/ImageCarousel/slick/slick.scss';
import 'src/components/ImageCarousel/slick/slicktheme.scss';

function SampleNextArrow(props) {
    const { className, style, onClick } = props;
    return (
      <div
        className="bs-slider-nav bs-slider-nav-next"
        style={{ ...style, display: "block"}}
        onClick={onClick}
      />
    );
  }
  
  function SamplePrevArrow(props) {
    const { className, style, onClick } = props;
    return (
      <div
      className="bs-slider-nav bs-slider-nav-pre"
        style={{ ...style, display: "block"}}
        onClick={onClick}
      />
    );
  }

class Related extends Component {
    static propTypes = {
        classes: PropTypes.shape({

        })
    }
    

    render(){
        const { relatedWrapper, relatedSlider, items, productName, priceWrapper, productPrice, btnNow  } = defaultClasses;
        const settings = {
            dots: false,
            infinite: true,
            speed: 500,
            slidesToShow: 4,
            slidesToScroll: 4,
            initialSlide: 0,
            nextArrow: <SampleNextArrow />,
            prevArrow: <SamplePrevArrow />,
            responsive: [
              {
                breakpoint: 1024,
                settings: {
                  slidesToShow: 4,
                  slidesToScroll: 4,
                  infinite: true,
                  dots: true
                }
              },
              {
                breakpoint: 800,
                settings: {
                  slidesToShow: 2,
                  slidesToScroll: 2,
                  initialSlide: 2
                }
              },
              {
                breakpoint: 480,
                settings: {
                  slidesToShow: 2,
                  slidesToScroll: 2
                }
              }
            ]
          };
        
        return(
            <div className={relatedWrapper}>
                <h2>{`Great Alternatives to This Product`}</h2>
                <div className={relatedSlider}>
                    <Slider {...settings}>
                        { 
                            this.props.items.map((item, index) => {
                                return <div key={index}>
                                    <div className={items}>
                                        <a href={item.url}>
                                            <img alt='Product Images' src={item.image} />
                                            <div className={productName}>{item.name}</div>
                                            <div className={priceWrapper}>
                                                <div className={productPrice}>{'Price '}{item.price}</div>
                                            </div>
                                            <div className={btnNow}>Buy Now</div> 
                                        </a> 
                                    </div>
                                </div>
                            })
                        }
                     </Slider>
                </div>
            </div>
            
        );
    }
}

export default classify({})(Related);