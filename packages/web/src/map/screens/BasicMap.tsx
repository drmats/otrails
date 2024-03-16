/**
 * @license BSD-2-Clause
 * @copyright Mat. 2024-present
 */

import type { FC } from "react";
import { useTranslation } from "react-i18next";

import MapGL from "~web/map/components/MapGL";
import { useAddressBarInteraction } from "~web/map/hooks";
import { useDocumentTitle } from "~web/layout/hooks";




/**
 * ...
 */
const BasicMap: FC = () => {
    const { t } = useTranslation();

    useAddressBarInteraction();
    useDocumentTitle(t("BasicMap:title"), true);

    return (
        <MapGL />
    );
};

export default BasicMap;
