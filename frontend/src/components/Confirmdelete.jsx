import React from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import styles from '../App.module.css';

function Confirmdelete({ jwttoken, quizid, setconfirmdeleteopen, onDeleteSuccess }) {
  const handleDelete = async () => {
    try {
      await axios.delete(`http://quizbuilder-env.eba-qrrtm5dv.ap-south-1.elasticbeanstalk.com/api/quiz/delete/${quizid}`, {
        headers: {
          'Authorization': `Bearer ${jwttoken}`,
          'Content-Type': 'application/json',
        },
      });
      toast.success('Quiz deleted successfully!');
      setconfirmdeleteopen(false);
      onDeleteSuccess(); 
    } catch (error) {
      toast.error('Error deleting quiz');
      console.error('Error deleting quiz:', error);
    }
  };

  return (
    <div className={styles.confirmdelete}>
      <div className={styles.deleteconfirmmenu}>
        <div>
          Are you sure you want to delete?
        </div>
        <div className={styles.confirmdeletebuttons}>
          <button onClick={handleDelete}>Confirm Delete</button>
          <button onClick={() => setconfirmdeleteopen(false)}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

export default Confirmdelete;
