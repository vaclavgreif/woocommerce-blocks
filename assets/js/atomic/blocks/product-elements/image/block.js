/**
 * External dependencies
 */
import PropTypes from 'prop-types';
import { Fragment } from '@wordpress/element';
import { __, sprintf } from '@wordpress/i18n';
import classnames from 'classnames';
import { PLACEHOLDER_IMG_SRC } from '@woocommerce/settings';
import {
	useInnerBlockLayoutContext,
	useProductDataContext,
} from '@woocommerce/shared-context';
import {
	useBorderProps,
	useSpacingProps,
	useTypographyProps,
} from '@woocommerce/base-hooks';
import { withProductDataContext } from '@woocommerce/shared-hocs';
import { useStoreEvents } from '@woocommerce/base-context/hooks';

/**
 * Internal dependencies
 */
import ProductSaleBadge from '../sale-badge/block';
import './style.scss';

/**
 * Product Image Block Component.
 *
 * @param {Object}            props                           Incoming props.
 * @param {string}            [props.className]               CSS Class name for the component.
 * @param {string|undefined}  [props.imageSizing]             Size of image to use.
 * @param {boolean|undefined} [props.showProductLink]         Whether or not to display a link to the product page.
 * @param {boolean}           [props.showSaleBadge]           Whether or not to display the on sale badge.
 * @param {string|undefined}  [props.saleBadgeAlign]          How should the sale badge be aligned if displayed.
 * @param {boolean}           [props.isDescendentOfQueryLoop] Whether or not be a children of Query Loop Block.
 * @return {*} The component.
 */
export const Block = ( props ) => {
	const {
		className,
		imageSizing = 'full-size',
		showProductLink = true,
		showSaleBadge,
		saleBadgeAlign = 'right',
	} = props;

	const { parentClassName } = useInnerBlockLayoutContext();
	const { product, isLoading } = useProductDataContext();

	const { dispatchStoreEvent } = useStoreEvents();

	const typographyProps = useTypographyProps( props );
	const borderProps = useBorderProps( props );
	const spacingProps = useSpacingProps( props );

	if ( ! product.id ) {
		return (
			<div
				className={ classnames(
					className,
					'wc-block-components-product-image',
					{
						[ `${ parentClassName }__product-image` ]:
							parentClassName,
					},
					borderProps.className
				) }
				style={ {
					...typographyProps.style,
					...borderProps.style,
					...spacingProps.style,
				} }
			>
				<ImagePlaceholder />
			</div>
		);
	}
	const hasProductImages = !! product.images.length;
	const image = hasProductImages ? product.images[ 0 ] : null;
	const ParentComponent = showProductLink ? 'a' : Fragment;
	const anchorLabel = sprintf(
		/* translators: %s is referring to the product name */
		__( 'Link to %s', 'woo-gutenberg-products-block' ),
		product.name
	);
	const anchorProps = {
		href: product.permalink,
		...( ! hasProductImages && { 'aria-label': anchorLabel } ),
		onClick: () => {
			dispatchStoreEvent( 'product-view-link', {
				product,
			} );
		},
	};

	return (
		<div
			className={ classnames(
				className,
				'wc-block-components-product-image',
				{
					[ `${ parentClassName }__product-image` ]: parentClassName,
				},
				borderProps.className
			) }
			style={ {
				...typographyProps.style,
				...borderProps.style,
				...spacingProps.style,
			} }
		>
			<ParentComponent { ...( showProductLink && anchorProps ) }>
				{ !! showSaleBadge && (
					<ProductSaleBadge
						align={ saleBadgeAlign }
						product={ product }
					/>
				) }
				<Image
					fallbackAlt={ product.name }
					image={ image }
					loaded={ ! isLoading }
					showFullSize={ imageSizing !== 'cropped' }
				/>
			</ParentComponent>
		</div>
	);
};

const ImagePlaceholder = () => {
	// The alt text is left empty on purpose, as it's considered a decorative image.
	// More can be found here: https://www.w3.org/WAI/tutorials/images/decorative/.
	// Github discussion for a context: https://github.com/woocommerce/woocommerce-blocks/pull/7651#discussion_r1019560494.
	return <img src={ PLACEHOLDER_IMG_SRC } alt="" />;
};

const Image = ( { image, loaded, showFullSize, fallbackAlt } ) => {
	const { thumbnail, src, srcset, sizes, alt } = image || {};
	const imageProps = {
		alt: alt || fallbackAlt,
		hidden: ! loaded,
		src: thumbnail,
		...( showFullSize && { src, srcSet: srcset, sizes } ),
	};

	return (
		<>
			{ imageProps.src && (
				/* eslint-disable-next-line jsx-a11y/alt-text */
				<img data-testid="product-image" { ...imageProps } />
			) }
			{ ! image && <ImagePlaceholder /> }
		</>
	);
};

Block.propTypes = {
	className: PropTypes.string,
	fallbackAlt: PropTypes.string,
	showProductLink: PropTypes.bool,
	showSaleBadge: PropTypes.bool,
	saleBadgeAlign: PropTypes.string,
};

export default withProductDataContext( Block );
