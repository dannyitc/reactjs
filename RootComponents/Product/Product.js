import React, { Component } from 'react';
import { Query } from 'src/drivers';
import ProductFullDetail from 'src/components/ProductFullDetail';
import ProductSkeleton from 'src/components/ProductFullDetail/ProductSkeleton';
import getUrlKey from 'src/util/getUrlKey';
import classify from 'src/classify';
import defaultClasses from './product.css';
import productQuery from 'src/queries/getProductDetail.graphql';
class Product extends Component {

    componentDidMount() {
        window.scrollTo(0, 0);
    }

    mapProduct(product) {
        const { description, short_description } = product;
        return {
            ...product,
            description:
                typeof description === 'object' ? description.html : description,
            short_description:
                typeof short_description === 'object' ? short_description.html : short_description
        };
    }

    render() {
        return (
            <Query
                query={productQuery}
                variables={{ urlKey: getUrlKey(), onServer: true }}
            >
                {({ loading, error, data }) => {
                    if (error) return null;
                    if (loading) {
                        return (
                            <ProductSkeleton />
                        );
                    }
                    const product = data.productDetail.items[0];
                    if (!product) return null;
                    document.title = product.name;
                    return (
                        <ProductFullDetail
                            product={this.mapProduct(product)}
                        />
                    );
                }}
            </Query>
        );
    }
}

export default classify(defaultClasses)(Product);
