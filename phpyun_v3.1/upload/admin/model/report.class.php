<?php
/* *
* $Author ��PHPYUN�����Ŷ�
*
* ����: http://www.phpyun.com
*
* ��Ȩ���� 2009-2014 ��Ǩ�γ���Ϣ�������޹�˾������������Ȩ����
*
* ����������δ����Ȩǰ���£�����������ҵ��Ӫ�����ο����Լ��κ���ʽ���ٴη�����
*/
class report_controller extends common
{
	function index_action(){
		extract($_GET);
		if($type=='0' || $type==''){
			if($_GET["ut"]=="2"){
				$this->yunset("ut",$_GET["ut"]);
				$where="`usertype`='".$_GET["ut"]."' and `type`='0' ";
				$urlarr["ut"]=$_GET["ut"];
				$urlarr["type"]=$_GET["type"];
 			}else{
				$this->yunset("ut",$_GET["ut"]);
				$where="`usertype`='1' and `type`='0' ";
 			}

			if($_GET["s"]!=""){
				$where.=" and `status`= ".$_GET["s"];
				$urlarr["s"]=$_GET["s"];
			}
			if ($_GET['qysearch']){
				if ($_GET['f_type']=='1'){
					$where.=" and `r_name` like '%".$_GET['qyname']."%' ";
				}elseif ($_GET['f_type']=='2'){
					$where.=" and `username` like '%".$_GET['qyname']."%' ";
				}elseif ($_GET['f_type']=='3'){
					$where.=" and `r_reason` like '%".$_GET['qyname']."%' ";
				}
				$urlarr['f_type']=$_GET['f_type'];
				$urlarr['qyname']=$_GET['qyname'];
				$urlarr['qysearch']=$_GET['qysearch'];
			}
			if($_GET['order'])
			{
				$where.=" order by ".$_GET['t']." ".$_GET['order'];
				$urlarr['order']=$_GET['order'];
				$urlarr['t']=$_GET['t'];
			}else{
				$where.=" order by id desc";
			}
			$urlarr["page"]="{{page}}";
			$pageurl=$this->url("index","report",$urlarr);
			$userrows=$this->get_page("report",$where,$pageurl,$this->config["sy_listnum"]);
			if($userrows &&is_array($userrows)){
				$uids=array();
				foreach($userrows as $val){
					if(in_array($val['c_uid'],$uids)==false){
						$uids[]=$val['c_uid'];
					}
				}
				$member=$this->obj->DB_select_all("member","`uid` in(".@implode(',',$uids).")","`uid`,`email`");
				if($member&&is_array($member)){
					foreach($member as $val){
						foreach($userrows as $key=>$value){
							if($val['uid']==$value['c_uid']){
								$userrows[$key]['email']=$val['email'];
							}
						}
					}
				}
			}
			$this->yunset("userrows",$userrows);
			$type='0';
		}else if($type=='1'){
			$where="`type`='1'";
			if ($_GET['status']=='0'){
				$where .=" and `status`='0'";
			}elseif($_GET['status']=='1'){
				$where .=" and `status`='1'";
			}
			$urlarr['status']=$_GET['status'];
			if ($_GET['comquestion']){
				if ($_GET['p_type']=='1'){
					$where .=" and `r_name` like '%".$_GET['question']."%'";
				}else{
					$where .=" and `username` like '%".$_GET['question']."%'";
				}
				$urlarr['p_type']=$_GET['p_type'];
				$urlarr['question']=$_GET['question'];
				$urlarr['comquestion']=$_GET['comquestion'];

				if ($_GET['r_type']!=''){
					$where .=" and `r_type`='".$_GET['r_type']."'";
					$urlarr['r_type']=$_GET['r_type'];
				}
			}
			if($_GET['order'])
			{
				$where.=" order by ".$_GET['t']." ".$_GET['order'];
				$urlarr['order']=$_GET['order'];
				$urlarr['t']=$_GET['t'];
			}else{
				$where.=" order by id desc";
			}
			$urlarr['type']=$_GET['type'];
			$urlarr["page"]="{{page}}";
			$pageurl=$this->url("index",$_GET['m'],$urlarr);
			$q_report=$this->get_page("report",$where,$pageurl,$this->config["sy_listnum"]);
			$reason=$this->obj->DB_select_all("reason","1","`id`,`name`");
			foreach($q_report as $key=>$val){
				if($val['r_type']=='1'){
					$q_report[$key]['c']="add";
					$question=$this->obj->DB_select_once("question","`id`='".$val['eid']."'","`title`");
					if($question['title']){
						$q_report[$key]['title']=$question['title'];
						$q_report[$key]['url']="index.php?m=admin_question&id=".$val['eid'];
					}else{
						$q_report[$key]['is_del']='�����ѱ�ɾ��';
					}
				}else if($val['r_type']=='2'){
					$q_report[$key]['c']="add_answer";
					$answer=$this->obj->DB_select_once("answer","`id`='".$val['eid']."'","content");
					if($answer['content']){
						$q_report[$key]['title']=$answer['content'];
						$q_report[$key]['url']="index.php?m=admin_question&c=get_answer&aid=".$val['eid'];
					}else{
						$q_report[$key]['is_del']='�ش��ѱ�ɾ��';
					}
				}else{
					$q_report[$key]['c']="add_review";
					$answer=$this->obj->DB_select_once("answer_review","`id`='".$val['eid']."'","content");
					if($answer['content']){
						$q_report[$key]['title']=$answer['content'];
						$q_report[$key]['url']="index.php?m=admin_question&c=get_comment&aid=".$val['eid'];
					}else{
						$q_report[$key]['is_del']='�����ѱ�ɾ��';
					}
				}
				foreach($reason as $r_v){
					if($val['r_reason']==$r_v['id']){
						$q_report[$key]['reason']=$r_v['name'];
					}else if($val['r_reason']=='0'){
						$q_report[$key]['reason']='ԭ���ѱ�ɾ��';
					}
				}
			}
			$this->yunset("q_report",$q_report);
		}
		$back_url=$_SERVER['PHP_SELF'].'?'.$_SERVER['QUERY_STRING'];
		$this->yunset("get_type", $_GET);
		$this->yunset("type",$type);
		$this->yunset("back_url",$back_url);
		$this->yuntpl(array('admin/admin_report_userlist'));
	}
	function recommend_action(){
		$nid=$this->obj->DB_update_all("report","`".$_GET['type']."`='".$_GET['rec']."'","`id`='".$_GET['id']."' and `type`='1'");
		echo $nid?1:0;die;
	}
	function del_action()
	{
		$this->check_token();
 	    if($_GET["del"]){
	    	$del=$_GET["del"];
	    	if($del){
	    		if(is_array($del)){
					$layer_type=1;
					$this->obj->DB_delete_all("report","`id` in(".@implode(',',$del).")","");
					$del=@implode(',',$del);
		    	}else{
					$this->obj->DB_delete_all("report","`id`='$del'");
					$layer_type=0;
		    	}
				$this->layer_msg('�ٱ�(ID:'.$del.')ɾ���ɹ���',9,$layer_type,$_SERVER['HTTP_REFERER']);
	    	}else{
				$this->layer_msg('��ѡ����Ҫɾ������Ϣ��',8,0,$_SERVER['HTTP_REFERER']);
	    	}
	    }
	}
}

?>