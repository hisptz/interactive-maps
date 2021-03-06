import * as _ from 'lodash';
import { VisualizationObject } from '../models/visualization-object.model';
import { MapConfiguration } from '../models/map-configuration.model';
import { Layer } from '../models/layer.model';
import { getBboxBounds } from './layers';
import { colorBrewer, getColorScale } from './colorBrewer';

export function transformVisualizationObject(visualizationObject) {
  let visObject = {};
  let geofeatures = {};
  let analytics = {};
  let orgUnitGroupSet = {};
  let serverSideConfig = {};
  const mapconfig = visualizationObject.details;
  const mapConfiguration: MapConfiguration = {
    id: mapconfig.id,
    name: mapconfig.name || visualizationObject.name,
    subtitle: mapconfig.subtitle,
    latitude: mapconfig.latitude,
    longitude: mapconfig.longitude,
    basemap: mapconfig.basemap,
    zoom: mapconfig.zoom,
    fullScreen: mapconfig.fullScreen
  };

  let layers: Layer[] = [];

  const vizObjLayers = visualizationObject.layers;

  vizObjLayers.forEach(mapview => {
    const settings = mapview.settings;
    const layer = {
      id: settings.id,
      name: settings.name,
      overlay: true,
      visible: true,
      areaRadius: settings.areaRadius,
      displayName: settings.displayName,
      opacity: settings.opacity || 1,
      hidden: settings.hidden,
      type: settings.layer ? settings.layer.replace(/\d$/, '') : 'thematic' // Replace number in thematic layers
    };

    const _layerOptions = _.pick(settings, [
      'eventClustering',
      'eventPointRadius',
      'eventPointColor',
      'radiusHigh',
      'radiusLow'
    ]);

    const serverClustering = mapview.analytics && mapview.analytics.hasOwnProperty('count');
    if (serverClustering) {
      const bounds = getBboxBounds(mapview.analytics['extent']);
      serverSideConfig = { ...serverSideConfig, bounds };
    }
    const layerOptions = { ..._layerOptions, serverClustering, serverSideConfig };

    const legendProperties = {
      colorLow: settings.colorLow,
      colorHigh: settings.colorHigh,
      colorScale: settings.colorScale || defaultColorScale,
      classes: settings.classes || defaultClasses,
      method: settings.method || 2
    };

    const { labelFontColor, labelFontSize, labelFontStyle, labels, hideTitle, hideSubtitle } = settings;
    const displaySettings = {
      labelFontColor: isColor(labelFontColor) ? labelFontColor : '#000000',
      labelFontSize,
      labelFontStyle,
      labels,
      hideSubtitle,
      hideTitle
    };

    const dataSelections = _.pick(settings, [
      'config',
      'parentLevel',
      'completedOnly',
      'translations',
      'interpretations',
      'program',
      'programStage',
      'columns',
      'rows',
      'filters',
      'aggregationType',
      'organisationUnitGroupSet',
      'startDate',
      'endDate'
    ]);

    const legendSet = settings.legendSet;

    const layerObj = {
      ...layer,
      layerOptions,
      legendProperties,
      displaySettings,
      legendSet,
      dataSelections
    };

    const geoFeature = { [settings.id]: settings.geoFeature };
    const analytic = { [settings.id]: mapview.analytics };
    const orgGroupSet = { [settings.id]: settings.organisationUnitGroupSet };
    geofeatures = { ...geofeatures, ...geoFeature };
    analytics = { ...analytics, ...analytic };
    orgUnitGroupSet = { ...orgUnitGroupSet, ...orgGroupSet };
    layers = [...layers, layerObj];
  });

  visObject = {
    ...visObject,
    mapConfiguration,
    orgUnitGroupSet,
    layers,
    geofeatures,
    analytics
  };

  return {
    visObject
  };
}

const defaultScaleKey = 'YlOrBr';
const defaultClasses = 5;
const isVersionGreater = Number(localStorage.getItem('version')) >= 2.28;
const defaultColorScale = getColorScale(defaultScaleKey, defaultClasses);
const isColor = color => /(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i.test(color);
