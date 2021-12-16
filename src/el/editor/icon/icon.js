import chevron_right from "./chevron_right";
import create_folder from "./create_folder";
import add_box from "./add_box";
import visible from "./visible";
import remove from "./remove";
import copy from "./copy";
import lock from "./lock";
import undo from "./undo";
import redo from "./redo";
import save from "./save";
import exportIcon from "./export";
import add from "./add";
import add_note from "./add_note";
import publish from "./publish";
import folder from "./folder";
import artboard from "./artboard";
import image from "./image";
import setting from "./setting";
import remove2 from "./remove2";
import repeat from "./repeat";
import screen from "./screen";
import arrowRight from "./arrowRight";
import check from "./check";
import border_all from "./border_all";
import border_inner from "./border_inner";
import paint from "./paint";
import title from "./title";
import timer from "./timer";
import chevron_left from "./chevron_left";
import input from "./input";
import filter from "./filter";
import play from "./play";
import pause from "./pause";
import autorenew from "./autorenew";
import code from "./code";
import build from "./build";
import close from "./close";
import gradient from "./gradient";
import transform from "./transform";
import scatter from "./scatter";
import shape from "./shape";
import ballot from "./ballot";
import add_circle from "./add_circle";
import lock_open from "./lock_open";
import outline_image from "./outline_image";
import edit from "./edit";
import size from "./size";
import color from "./color";
import align_center from "./align_center";
import align_justify from "./align_justify";
import align_left from "./align_left";
import align_right from "./align_right";
import list from "./list";
import grid from "./grid";
import grid3x3 from "./grid3x3";
import expand from "./expand";
import brush from "./brush";
import dahaze from "./dahaze";
import star from "./star";
import polygon from "./polygon";
import cube from "./cube";
import color_lens from "./color_lens";
import circle from "./circle";
import rect from "./rect";
import note from "./note";
import skip_next from "./skip_next";
import skip_prev from "./skip_prev";
import fast_forward from "./fast_forward";
import fast_rewind from "./fast_rewind";
import alternate from "./alternate";
import alternate_reverse from "./alternate_reverse";
import speed from "./speed";
import replay from "./replay";
import shuffle from "./shuffle";
import cat from "./cat";
import refresh from "./refresh";
import gps_fixed from "./gps_fixed";
import file_copy from "./file_copy";
import archive from "./archive";
import storage from "./storage";
import doc from "./doc";
import flash_on from "./flash_on";
import view_list from "./view_list";
import near_me from "./near_me";
import photo from "./photo";
import specular from "./specular";
import diffuse from "./diffuse";
import palette from "./palette";
import landscape from "./landscape";
import blur from "./blur";
import blur_linear from "./blur_linear";
import waves from "./waves";
import vintage from "./vintage";
import looks from "./looks";
import opacity from "./opacity";
import shadow from "./shadow";
import broken_image from "./broken_image";
import camera_roll from "./camera_roll";
import view_comfy from "./view_comfy";
import settings_input_component from "./settings_input_component";
import merge from "./merge";
import texture from "./texture";
import account_tree from "./account_tree";
import format_shapes from "./format_shapes";
import flip from "./flip";
import flipY from "./flipY";
import control_point from "./control_point";
import flip_camera from "./flip_camera";
import device_hub from "./device_hub";
import text_rotate from "./text_rotate";
import cylinder from "./cylinder";
import underline from "./underline";
import strikethrough from "./strikethrough";
import italic from "./italic";
import local_library from "./local_library";
import lens from "./lens";
import flag from "./flag";
import left from "./left";
import center from "./center";
import right from "./right";
import top from "./top";
import bottom from "./bottom";
import middle from "./middle";
import same_width from "./same_width";
import same_height from "./same_height";
import local_movie from "./local_movie";
import keyboard from "./keyboard";
import apps from "./apps";
import outline_rect from "./outline_rect";
import outline_circle from "./outline_circle";
import launch from "./launch";
import pentool from "./pentool";
import video from "./video";
import volume_down from "./volume_down";
import volume_up from "./volume_up";
import volume_off from "./volume_off";
import arrowLeft from "./arrowLeft";
import group from "./group";
import arrow_right from "./arrow_right";
import layers from "./layers";
import align_horizontal_center from "./align_horizontal_center";
import align_horizontal_left from "./align_horizontal_left";
import align_horizontal_right from "./align_horizontal_right";
import align_vertical_bottom from "./align_vertical_bottom";
import align_vertical_center from "./align_vertical_center";
import align_vertical_top from "./align_vertical_top";
import swap_horiz from "./swap_horiz";
import rotate_left from "./rotate_left";
import open_in_full from "./open_in_full";
import rotate from "./rotate";
import vertical_distribute from "./vertical_distribute";
import horizontal_distribute from "./horizontal_distribute";
import delete_forever from "./delete_forever";
import horizontal_rule from "./horizontal_rule";
import navigation from "./navigation";
import web from "./web";
import auto_awesome from "./auto_awesome";
// import chart from "./chart";
// import line_chart from "./line_chart";
// import bar_chart from "./bar_chart";
import plugin from "./plugin";
import straighten from "./straighten";
import left_hide from "./left_hide";
import right_hide from "./right_hide";
import pantool from "./pantool";
import draw from "./draw";
import flex from "./flex";
import margin from "./margin";
import source from "./source";
import sync from "./sync";
import outline from "./outline";
import dark from "./dark";
import wave from "./wave";
import boolean_union from "./boolean_union";
import boolean_difference from "./boolean_difference";
import boolean_intersection from "./boolean_intersection";
import boolean_xor from "./boolean_xor";
import flatten from "./flatten";
import smooth from "./smooth";
import stroke_to_path from "./stroke_to_path";
import highlight_at from "./highlight_at";
import to_front from "./to_front";
import to_back from "./to_back";
import light from "./light";
import unfold from "./unfold";
import outline_shape from "./outline_shape";
import switch_left from "./switch_left";
import switch_right from "./switch_right";
import line_cap_butt from "./line_cap_butt";
import line_cap_round from "./line_cap_round";
import line_cap_square from "./line_cap_square";
import line_join_bevel from "./line_join_bevel";
import line_join_round from "./line_join_round";
import line_join_miter from "./line_join_miter";
import vertical_align_bottom from "./vertical_align_bottom";
import vertical_align_top from "./vertical_align_top";
import vertical_align_center from "./vertical_align_center";
import start from "./start";
import wrap_text from "./wrap_text";
import end from "./end";
import table_rows from "./table_rows";
import view_week from "./view_week";
import view_week_reverse from "./view_week_reverse";




const alias = {
  fullscreen:  border_inner
}

export function iconUse(name, transform = "", opt = { width: 24, height: 24 }) {
  return /*html*/`
    <svg viewBox="0 0 ${opt.width} ${opt.height}" xmlns="http://www.w3.org/2000/svg">
      <use href="#icon-${name}" transform="${transform}" width="${opt.width}" height="${opt.height}" /> 
    </svg>
  `
}


export default {
  ...alias,
  view_week_reverse,
  view_week,
  table_rows,
  wrap_text,
  start,
  end,
  vertical_align_center,
  vertical_align_bottom,
  vertical_align_top,
  line_cap_butt,
  line_cap_round,
  line_cap_square,
  line_join_bevel,
  line_join_round,
  line_join_miter,  
  switch_right,
  switch_left,
  outline_shape,
  unfold,
  light,
  to_back,
  to_front,
  highlight_at,
  grid3x3,
  stroke_to_path,
  smooth,
  flatten,
  boolean_union,
  boolean_difference,
  boolean_intersection,
  boolean_xor,
  wave,
  dark,
  outline,
  sync,
  source,
  flex,
  margin,
  draw,
  pantool,
  left_hide,
  right_hide,
  // bar_chart,
  straighten,
  plugin,
  // chart,
  // line_chart,
  auto_awesome,
  web,
  navigation,
  delete_forever,
  horizontal_rule,
  open_in_full,
  rotate,
  align_horizontal_center,
  align_horizontal_left,
  align_horizontal_right,
  align_vertical_bottom,
  align_vertical_center,
  align_vertical_top,  
  vertical_distribute,
  horizontal_distribute,
  rotate_left,
  swap_horiz,  
  arrow_right,  
  group,
  volume_down,
  arrowLeft,
  volume_up,
  volume_off,
  pentool,
  launch,
  apps,
  outline_rect,
  outline_circle,
  keyboard,
  local_movie,
  same_height,
  same_width,
  layers,
  middle,
  bottom,
  top,
  right,
  center,
  left,
  flag,
  lens,
  local_library,
  italic,
  strikethrough,
  underline,
  cylinder,
  text_rotate,
  device_hub,
  control_point,
  flip_camera,
  flipY,
  flip,
  account_tree,
  format_shapes,  
  merge,
  texture,
  settings_input_component,
  view_comfy,
  camera_roll,
  broken_image,
  shadow,
  opacity,
  looks,
  vintage,
  waves,
  blur_linear,
  blur,
  landscape,
  palette,
  diffuse,
  specular,
  photo,
  near_me,
  view_list,
  flash_on,
  doc,
  storage,
  archive,
  file_copy,
  gps_fixed,
  refresh,
  cat,
  shuffle,
  replay,
  speed,
  alternate_reverse,
  alternate,
  note,
  rect,
  circle,
  color_lens,
  cube,
  polygon,
  star,
  dahaze,
  brush,
  expand,
  list,
  grid,
  align_center,
  align_justify,
  align_left,
  align_right,
  color,
  size,
  edit,
  outline_image,
  ballot,
  shape,
  scatter,
  transform,
  gradient,
  close,
  build,
  code,
  autorenew,
  play,
  pause,
  skip_next,
  skip_prev,
  fast_forward,
  fast_rewind,  
  filter,
  input,
  timer,
  title,
  paint,
  border_all,
  border_inner,
  check,
  video,
  arrowRight,
  screen,
  repeat,
  remove2,
  setting,
  image,
  artboard,
  folder,
  publish,
  add_note,
  add,
  save,
  export: exportIcon,
  redo,
  undo,
  lock,
  lock_open,  
  remove,
  copy,
  visible,
  add_box,
  add_circle,
  create_folder,
  chevron_right,
  chevron_left
};
