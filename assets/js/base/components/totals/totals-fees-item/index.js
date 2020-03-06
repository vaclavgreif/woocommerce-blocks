/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import {
	DISPLAY_CART_PRICES_INCLUDING_TAX,
	SHIPPING_ENABLED,
} from '@woocommerce/block-settings';
import PropTypes from 'prop-types';

/**
 * Internal dependencies
 */
import TotalsItem from '../totals-item';

const TotalsFeesItem = ( { currency, values } ) => {
	if ( ! SHIPPING_ENABLED ) {
		return null;
	}
	const { total_fees: totalFees, total_fees_tax: totalFeesTax } = values;
	const feesValue = parseInt( totalFees, 10 );

	if ( ! feesValue ) {
		return null;
	}

	const feesTaxValue = parseInt( totalFeesTax, 10 );

	return (
		<TotalsItem
			currency={ currency }
			label={ __( 'Fees', 'woo-gutenberg-products-block' ) }
			value={
				DISPLAY_CART_PRICES_INCLUDING_TAX
					? feesValue + feesTaxValue
					: feesValue
			}
		/>
	);
};

TotalsFeesItem.propTypes = {
	currency: PropTypes.object.isRequired,
	values: PropTypes.shape( {
		total_fees: PropTypes.string,
		total_fees_tax: PropTypes.string,
	} ).isRequired,
};

export default TotalsFeesItem;
