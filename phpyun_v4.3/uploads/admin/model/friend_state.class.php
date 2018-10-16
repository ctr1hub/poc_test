<?php
/*
* $Author ��PHPYUN�����Ŷ�
*
* ����: http://www.phpyun.com
*
* ��Ȩ���� 2009-2017 ��Ǩ�γ���Ϣ�������޹�˾������������Ȩ����
*
* ����������δ����Ȩǰ���£�����������ҵ��Ӫ�����ο����Լ��κ���ʽ���ٴη�����
 */
class friend_state_controller extends common
{
	function set_search(){
		$ad_time=array('1'=>'����','3'=>'�������','7'=>'�������','15'=>'�������','30'=>'���һ����');
		$search_list[]=array("param"=>"end","name"=>'����ʱ��',"value"=>$ad_time);
		$this->yunset("search_list",$search_list);
	}
	function index_action(){
		include(PLUS_PATH."user.cache.php");
		include(PLUS_PATH."com.cache.php");
		$this->set_search();
		$where = "1";
		if($_GET['end']){
			if($_GET['end']=='1'){
				$where.=" and `ctime` >= '".strtotime(date("Y-m-d 00:00:00"))."'";
			}else{
				$where.=" and `ctime` >= '".strtotime('-'.$_GET['end'].'day')."'";
			}
			$urlarr['end']=$_GET['end'];
		}
		if(trim($_GET['keyword'])){
			if($_GET['type']=='1'){
				$infouid = $this->obj->DB_select_all("member","`username`like '%".trim($_GET['keyword'])."%'","`uid`,`username`");
				foreach($infouid as $val){
					$uid[]=$val['uid'];
				}
				$where.=" and `uid` in(".pylode(',',$uid).")";
			}else if($_GET['type']=='2'){
				$where.=" and `content` like '%".trim($_GET['keyword'])."%'";
			}
			$urlarr['type']=$_GET['type'];
			$urlarr['keyword']=$_GET['keyword'];
		} 
		if($_GET['order']){
			$where.=" order by ".$_GET['t']." ".$_GET['order'];
			$urlarr['order']=$_GET['order'];
			$urlarr['t']=$_GET['t'];
		}else{
			$where.=" order by id desc";
		}
        $urlarr['status']=$_GET['status'];
        $urlarr['order']=$_GET['order'];
		$urlarr['page']="{{page}}"; 
		$pageurl=Url($_GET['m'],$urlarr,'admin');
		$mes_list=$this->get_page("friend_state",$where,$pageurl,$this->config['sy_listnum']);
		if(is_array($mes_list)){
			if($infouid==''){
				$uids=array();
				foreach($mes_list as $value){
					$uids[]=$value['uid'];
				}
				$infouid = $this->obj->DB_select_all("member","`uid` in (".@implode(',',$uids).")","`uid`,`username`");
			}
			foreach($mes_list as $key=>$value){
				foreach($infouid as $k=>$v){
					if($value['uid']==$v['uid']){
						$mes_list[$key]['username'] = $v['username'];
					}
				}
			}
		}
		$this->yunset("get_type", $_GET);
		$this->yunset("mes_list",$mes_list);
		$this->yuntpl(array('admin/friend_state'));
	}

	function del_action(){

		$this->check_token();
	    if($_GET['del']){
	    	$del=$_GET['del'];
	    	if($_GET['del']){
	    		if(is_array($_GET['del'])){
					$this->obj->DB_delete_all("friend_state","`id` in(".@implode(',',$_GET['del']).")","");
					$del=@implode(',',$_GET['del']);
					$layer_type='1';
		    	}else{
					$layer_type='0';
		    		$this->obj->DB_delete_all("friend_state","`id`='$del'");
		    	}
	    		$this->layer_msg( "��Ա��̬(ID:".$del.")ɾ���ɹ���",9,$layer_type,$_SERVER['HTTP_REFERER']);
	    	}else{
	    		$this->layer_msg( "��ѡ����Ҫɾ������Ϣ��",8,1,$_SERVER['HTTP_REFERER']);
	    	}
	    }
		if($_GET['time']){
			$time=strtotime($_GET['time']." 23:59:59");
			$friend_state=$this->obj->DB_select_all("friend_state","`ctime`<'$time'","id");
			if($friend_state&&is_array($friend_state)){
				foreach($friend_state as $val){
					$ids[]=$val['id'];
				}
				$ids=@implode(',',$ids);
				$this->obj->DB_delete_all("friend_state","`id` in (".$ids.")","");
			}
			$this->layer_msg("��Ա��̬(ID:".$ids.")ɾ���ɹ���",9,0,$_SERVER['HTTP_REFERER']);
		}
	}
}