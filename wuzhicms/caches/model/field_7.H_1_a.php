<?php
 return array (
  'youku' => 
  array (
    'id' => '536',
    'modelid' => '7',
    'field' => 'youku',
    'name' => '优酷播放',
    'remark' => '',
    'css' => '',
    'minlength' => '0',
    'maxlength' => '0',
    'pattern' => '',
    'errortips' => '',
    'formtype' => 'video_youku',
    'setting' => '',
    'ext_code' => '',
    'unsetgids' => '',
    'unsetroles' => '',
    'master_field' => '0',
    'ban_field' => '0',
    'location' => '0',
    'search_field' => '0',
    'ban_contribute' => '1',
    'to_fulltext' => '1',
    'to_block' => '0',
    'sort' => '0',
    'disabled' => '0',
    'powerful_field' => '0',
    'workflow_field' => '0',
    'master_table' => 'content_share',
    'attr_table' => 'video_data',
  ),
  'tudou' => 
  array (
    'id' => '537',
    'modelid' => '7',
    'field' => 'tudou',
    'name' => '土豆播放',
    'remark' => '',
    'css' => '',
    'minlength' => '0',
    'maxlength' => '0',
    'pattern' => '',
    'errortips' => '',
    'formtype' => 'video_tudou',
    'setting' => '',
    'ext_code' => '',
    'unsetgids' => '',
    'unsetroles' => '',
    'master_field' => '0',
    'ban_field' => '0',
    'location' => '0',
    'search_field' => '0',
    'ban_contribute' => '1',
    'to_fulltext' => '1',
    'to_block' => '0',
    'sort' => '0',
    'disabled' => '0',
    'powerful_field' => '0',
    'workflow_field' => '0',
    'master_table' => 'content_share',
    'attr_table' => 'video_data',
  ),
  'cid' => 
  array (
    'id' => '470',
    'modelid' => '7',
    'field' => 'cid',
    'name' => '所属栏目',
    'remark' => '',
    'css' => '',
    'minlength' => '1',
    'maxlength' => '0',
    'pattern' => '',
    'errortips' => '请选择栏目',
    'formtype' => 'cid',
    'setting' => '',
    'ext_code' => '',
    'unsetgids' => '',
    'unsetroles' => '',
    'master_field' => '1',
    'ban_field' => '1',
    'location' => '5',
    'search_field' => '0',
    'ban_contribute' => '0',
    'to_fulltext' => '0',
    'to_block' => '0',
    'sort' => '1',
    'disabled' => '0',
    'powerful_field' => '0',
    'workflow_field' => '0',
    'master_table' => 'content_share',
    'attr_table' => 'video_data',
  ),
  'title' => 
  array (
    'id' => '471',
    'modelid' => '7',
    'field' => 'title',
    'name' => '标题',
    'remark' => '',
    'css' => '',
    'minlength' => '2',
    'maxlength' => '80',
    'pattern' => '',
    'errortips' => '请输入标题',
    'formtype' => 'title',
    'setting' => '',
    'ext_code' => '',
    'unsetgids' => '',
    'unsetroles' => '',
    'master_field' => '1',
    'ban_field' => '1',
    'location' => '5',
    'search_field' => '0',
    'ban_contribute' => '1',
    'to_fulltext' => '1',
    'to_block' => '1',
    'sort' => '2',
    'disabled' => '0',
    'powerful_field' => '0',
    'workflow_field' => '0',
    'master_table' => 'content_share',
    'attr_table' => 'video_data',
  ),
  'keywords' => 
  array (
    'id' => '472',
    'modelid' => '7',
    'field' => 'keywords',
    'name' => '关键词',
    'remark' => '多关键词之间用半角逗号“,”隔开',
    'css' => '',
    'minlength' => '0',
    'maxlength' => '0',
    'pattern' => '',
    'errortips' => '',
    'formtype' => 'keyword',
    'setting' => '',
    'ext_code' => '',
    'unsetgids' => '',
    'unsetroles' => '',
    'master_field' => '1',
    'ban_field' => '1',
    'location' => '0',
    'search_field' => '1',
    'ban_contribute' => '0',
    'to_fulltext' => '1',
    'to_block' => '0',
    'sort' => '3',
    'disabled' => '0',
    'powerful_field' => '0',
    'workflow_field' => '0',
    'master_table' => 'content_share',
    'attr_table' => 'video_data',
  ),
  'remark' => 
  array (
    'id' => '468',
    'modelid' => '7',
    'field' => 'remark',
    'name' => '摘要',
    'remark' => '',
    'css' => '',
    'minlength' => '0',
    'maxlength' => '0',
    'pattern' => '',
    'errortips' => '',
    'formtype' => 'textarea',
    'setting' => 
    array (
      'defaultvalue' => '',
      'enablehtml' => '0',
    ),
    'ext_code' => '',
    'unsetgids' => '',
    'unsetroles' => '',
    'master_field' => '1',
    'ban_field' => '1',
    'location' => '0',
    'search_field' => '0',
    'ban_contribute' => '0',
    'to_fulltext' => '1',
    'to_block' => '1',
    'sort' => '4',
    'disabled' => '0',
    'powerful_field' => '0',
    'workflow_field' => '0',
    'master_table' => 'content_share',
    'attr_table' => 'video_data',
  ),
  'thumb' => 
  array (
    'id' => '466',
    'modelid' => '7',
    'field' => 'thumb',
    'name' => '缩略图',
    'remark' => '',
    'css' => '',
    'minlength' => '0',
    'maxlength' => '0',
    'pattern' => '',
    'errortips' => '',
    'formtype' => 'image',
    'setting' => 
    array (
      'defaultvalue' => '',
      'upload_allowext' => 'gif|jpg|jpeg|png|bmp',
      'watermark' => '0',
      'isselectimage' => '1',
      'images_width' => '',
      'images_height' => '',
    ),
    'ext_code' => '',
    'unsetgids' => '',
    'unsetroles' => '',
    'master_field' => '1',
    'ban_field' => '1',
    'location' => '0',
    'search_field' => '0',
    'ban_contribute' => '0',
    'to_fulltext' => '0',
    'to_block' => '1',
    'sort' => '5',
    'disabled' => '0',
    'powerful_field' => '0',
    'workflow_field' => '0',
    'master_table' => 'content_share',
    'attr_table' => 'video_data',
  ),
  'block' => 
  array (
    'id' => '459',
    'modelid' => '7',
    'field' => 'block',
    'name' => '添加到推荐位',
    'remark' => '',
    'css' => '',
    'minlength' => '0',
    'maxlength' => '0',
    'pattern' => '',
    'errortips' => '',
    'formtype' => 'block',
    'setting' => '',
    'ext_code' => '',
    'unsetgids' => '',
    'unsetroles' => '',
    'master_field' => '1',
    'ban_field' => '0',
    'location' => '0',
    'search_field' => '0',
    'ban_contribute' => '0',
    'to_fulltext' => '0',
    'to_block' => '0',
    'sort' => '6',
    'disabled' => '0',
    'powerful_field' => '0',
    'workflow_field' => '0',
    'master_table' => 'content_share',
    'attr_table' => 'video_data',
  ),
  'content' => 
  array (
    'id' => '469',
    'modelid' => '7',
    'field' => 'content',
    'name' => '正文',
    'remark' => '',
    'css' => '',
    'minlength' => '0',
    'maxlength' => '0',
    'pattern' => '',
    'errortips' => '',
    'formtype' => 'editor',
    'setting' => 
    array (
      'defaultvalue' => '',
      'enablesaveimage' => '1',
      'watermark_enable' => '0',
    ),
    'ext_code' => '',
    'unsetgids' => '',
    'unsetroles' => '',
    'master_field' => '0',
    'ban_field' => '0',
    'location' => '5',
    'search_field' => '0',
    'ban_contribute' => '1',
    'to_fulltext' => '1',
    'to_block' => '0',
    'sort' => '8',
    'disabled' => '0',
    'powerful_field' => '0',
    'workflow_field' => '0',
    'master_table' => 'content_share',
    'attr_table' => 'video_data',
  ),
  'url' => 
  array (
    'id' => '461',
    'modelid' => '7',
    'field' => 'url',
    'name' => '链接地址',
    'remark' => '',
    'css' => '',
    'minlength' => '0',
    'maxlength' => '0',
    'pattern' => '',
    'errortips' => '',
    'formtype' => 'url',
    'setting' => '',
    'ext_code' => '',
    'unsetgids' => '',
    'unsetroles' => '',
    'master_field' => '1',
    'ban_field' => '1',
    'location' => '1',
    'search_field' => '0',
    'ban_contribute' => '0',
    'to_fulltext' => '0',
    'to_block' => '1',
    'sort' => '11',
    'disabled' => '0',
    'powerful_field' => '0',
    'workflow_field' => '0',
    'master_table' => 'content_share',
    'attr_table' => 'video_data',
  ),
  'relation' => 
  array (
    'id' => '467',
    'modelid' => '7',
    'field' => 'relation',
    'name' => '相关内容',
    'remark' => '',
    'css' => '',
    'minlength' => '0',
    'maxlength' => '0',
    'pattern' => '',
    'errortips' => '',
    'formtype' => 'relation',
    'setting' => '',
    'ext_code' => '',
    'unsetgids' => '',
    'unsetroles' => '',
    'master_field' => '0',
    'ban_field' => '0',
    'location' => '1',
    'search_field' => '0',
    'ban_contribute' => '0',
    'to_fulltext' => '0',
    'to_block' => '0',
    'sort' => '11',
    'disabled' => '0',
    'powerful_field' => '0',
    'workflow_field' => '0',
    'master_table' => 'content_share',
    'attr_table' => 'video_data',
  ),
  'addtime' => 
  array (
    'id' => '458',
    'modelid' => '7',
    'field' => 'addtime',
    'name' => '添加时间',
    'remark' => '',
    'css' => '',
    'minlength' => '0',
    'maxlength' => '0',
    'pattern' => '',
    'errortips' => '',
    'formtype' => 'datetime',
    'setting' => 
    array (
      'fieldtype' => 'int',
      'format' => 'Y-m-d H:i:s',
    ),
    'ext_code' => '',
    'unsetgids' => '',
    'unsetroles' => '',
    'master_field' => '1',
    'ban_field' => '1',
    'location' => '1',
    'search_field' => '0',
    'ban_contribute' => '0',
    'to_fulltext' => '0',
    'to_block' => '1',
    'sort' => '12',
    'disabled' => '0',
    'powerful_field' => '0',
    'workflow_field' => '0',
    'master_table' => 'content_share',
    'attr_table' => 'video_data',
  ),
  'allowcomment' => 
  array (
    'id' => '464',
    'modelid' => '7',
    'field' => 'allowcomment',
    'name' => '允许评论',
    'remark' => '',
    'css' => '',
    'minlength' => '0',
    'maxlength' => '0',
    'pattern' => '',
    'errortips' => '',
    'formtype' => 'box',
    'setting' => 
    array (
      'options' => '允许|1
不允许|0',
      'boxtype' => 'radio',
      'fieldtype' => 'tinyint',
      'minnumber' => '1',
      'defaultvalue' => '1',
      'outputtype' => '0',
    ),
    'ext_code' => '',
    'unsetgids' => '',
    'unsetroles' => '',
    'master_field' => '0',
    'ban_field' => '0',
    'location' => '2',
    'search_field' => '0',
    'ban_contribute' => '0',
    'to_fulltext' => '0',
    'to_block' => '0',
    'sort' => '17',
    'disabled' => '0',
    'powerful_field' => '0',
    'workflow_field' => '0',
    'master_table' => 'content_share',
    'attr_table' => 'video_data',
  ),
  'groups' => 
  array (
    'id' => '460',
    'modelid' => '7',
    'field' => 'groups',
    'name' => '用户组权限',
    'remark' => '',
    'css' => '',
    'minlength' => '0',
    'maxlength' => '0',
    'pattern' => '',
    'errortips' => '',
    'formtype' => 'group',
    'setting' => 
    array (
      'groups' => '4,5',
    ),
    'ext_code' => '',
    'unsetgids' => '',
    'unsetroles' => '',
    'master_field' => '0',
    'ban_field' => '0',
    'location' => '2',
    'search_field' => '0',
    'ban_contribute' => '0',
    'to_fulltext' => '0',
    'to_block' => '0',
    'sort' => '18',
    'disabled' => '0',
    'powerful_field' => '0',
    'workflow_field' => '0',
    'master_table' => 'content_share',
    'attr_table' => 'video_data',
  ),
  'sort' => 
  array (
    'id' => '462',
    'modelid' => '7',
    'field' => 'sort',
    'name' => '权重',
    'remark' => '',
    'css' => '',
    'minlength' => '0',
    'maxlength' => '255',
    'pattern' => '',
    'errortips' => '',
    'formtype' => 'slider',
    'setting' => 
    array (
      'defaultvalue' => '0',
    ),
    'ext_code' => '',
    'unsetgids' => '',
    'unsetroles' => '',
    'master_field' => '1',
    'ban_field' => '1',
    'location' => '1',
    'search_field' => '0',
    'ban_contribute' => '0',
    'to_fulltext' => '0',
    'to_block' => '0',
    'sort' => '20',
    'disabled' => '0',
    'powerful_field' => '0',
    'workflow_field' => '0',
    'master_table' => 'content_share',
    'attr_table' => 'video_data',
  ),
  'template' => 
  array (
    'id' => '463',
    'modelid' => '7',
    'field' => 'template',
    'name' => '内容页模板',
    'remark' => '',
    'css' => '',
    'minlength' => '0',
    'maxlength' => '0',
    'pattern' => '',
    'errortips' => '',
    'formtype' => 'template',
    'setting' => '',
    'ext_code' => '',
    'unsetgids' => '',
    'unsetroles' => '',
    'master_field' => '0',
    'ban_field' => '0',
    'location' => '1',
    'search_field' => '0',
    'ban_contribute' => '0',
    'to_fulltext' => '0',
    'to_block' => '0',
    'sort' => '21',
    'disabled' => '0',
    'powerful_field' => '0',
    'workflow_field' => '0',
    'master_table' => 'content_share',
    'attr_table' => 'video_data',
  ),
  'status' => 
  array (
    'id' => '465',
    'modelid' => '7',
    'field' => 'status',
    'name' => '稿件状态',
    'remark' => '',
    'css' => '',
    'minlength' => '0',
    'maxlength' => '0',
    'pattern' => '',
    'errortips' => '',
    'formtype' => 'box',
    'setting' => 
    array (
      'options' => '通过审核|9
待审|1
定时发送|8
草稿|6',
      'boxtype' => 'radio',
      'fieldtype' => 'tinyint',
      'minnumber' => '1',
      'defaultvalue' => '9',
      'outputtype' => '0',
    ),
    'ext_code' => '',
    'unsetgids' => '',
    'unsetroles' => '',
    'master_field' => '1',
    'ban_field' => '1',
    'location' => '0',
    'search_field' => '0',
    'ban_contribute' => '0',
    'to_fulltext' => '0',
    'to_block' => '0',
    'sort' => '30',
    'disabled' => '0',
    'powerful_field' => '0',
    'workflow_field' => '0',
    'master_table' => 'content_share',
    'attr_table' => 'video_data',
  ),
)?>